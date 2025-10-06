import { shortenBodySchema } from "../validation/request.validation.js";
import { nanoid } from "nanoid";
import { insertShortCodeIntoTable, updateURLFromTable, urlBelongsToUser, deleteURLFromTable } from "../services/url.service.js";
import { urlsTable, urlAnalyticsTable } from "../models/url.model.js";
import { and, eq, sql } from "drizzle-orm";
import db from "../db/index.js";
import { UAParser } from "ua-parser-js";
import fetch from "node-fetch";

export const shorten = async(req,res) => {
    try{
        const validationResult = await shortenBodySchema.safeParseAsync(req.body);
        if(validationResult.error){
            return res.status(400).json({ 
                error: validationResult.error
            })
        }
        const { url, code } = validationResult.data;
        const shortCode = code ?? nanoid(6);

        const result = await insertShortCodeIntoTable(shortCode, url, req.user.id);

        return res.status(201).json({
            result: {
                id: result.id,
                shortCode: result.shortCode,
                targetURL: result.targetURL,
            }
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

export const getTargetURL = async (req, res) => { 
    try {
        const code = req.params.shortCode;

        // Find the target URL for the given short code
        const [result] = await db
        .select({
            id: urlsTable.id,
            targetURL: urlsTable.targetURL,
        })
        .from(urlsTable)
        .where(eq(urlsTable.shortCode, code));

        if (!result) {
            return res.status(404).json({
                error: "Invalid URL",
            });
        }

        // --- Collect Analytics Info ---
        const userAgent = req.headers["user-agent"];
        const parser = new UAParser(userAgent);
        const ua = parser.getResult();

        const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

        let location = {
            country: "Unknown",
            region: "Unknown",
            city: "Unknown",
        };

        try {
        // Optional: use free geolocation API
            const geo = await fetch(`https://ipapi.co/${ip}/json/`).then((r) => r.json());
            location = {
                country: geo.country_name || "Unknown",
                region: geo.region || "Unknown",
                city: geo.city || "Unknown",
            };
        } catch (e) {
            console.log("Geo lookup failed:", e.message);
        }

        // Insert analytics record into DB
        await db.insert(urlAnalyticsTable).values({
        urlId: result.id,
        ipAddress: ip,
        region: location.region,
        country: location.country,
        city: location.city,
        deviceType: ua.device.type || "desktop",
        browser: ua.browser.name || "unknown",
        userAgent,
        });

        // --- Redirect the user ---
        return res.redirect(result.targetURL);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export const getAllCreatedCodes = async(req,res) => {
    try{
        const codes = await db.select()
        .from(urlsTable)
        .where(eq(urlsTable.userId, req.user.id));

        return res.status(200).json({
            codes
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

export const deleteCreatedURL = async(req,res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        
        const existingURL = await urlBelongsToUser(id, userId);

        if (!existingURL) {
            return res.status(404).json({
                error: "URL not found or you don't have permission to delete it"
            });
        }

        await deleteURLFromTable(id, userId);

        return res.status(200).json({
            success: true,
            message: "Deleted successfully"
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

export const updateCreatedURL = async(req,res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const { newURL } = req.body; 
        
        if(!newURL || typeof newURL !== "string") {
            return res.status(400).json({ error: "New URL is required" });
        }

        const existingURL = await urlBelongsToUser(id, userId);

        if(!existingURL) {
            return res.status(404).json({
                error: "URL not found or you don't have permission to update it"
            });
        }

        const updated = await updateURLFromTable(id, userId, newURL);

        return res.status(200).json({
            success: true,
            message: "URL updated successfully",
            updated
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

export const getAnalytics = async (req, res) => {
    try {
        const id = req.params.id;

        // Step 1: Check if URL exists
        const [url] = await db
        .select({
            id: urlsTable.id,
            targetURL: urlsTable.targetURL,
            shortCode: urlsTable.shortCode,
        })
        .from(urlsTable)
        .where(eq(urlsTable.id, id));

        if (!url) {
            return res.status(404).json({ error: "URL not found" });
        }

        // Step 2: Get total clicks
        const [clicks] = await db
        .select({ total: sql`COUNT(*)` })
        .from(urlAnalyticsTable)
        .where(eq(urlAnalyticsTable.urlId, id));

        // Step 3: Group by country
        const countryStats = await db
        .select({
            country: urlAnalyticsTable.country,
            count: sql`COUNT(*)`,
        })
        .from(urlAnalyticsTable)
        .where(eq(urlAnalyticsTable.urlId, id))
        .groupBy(urlAnalyticsTable.country);

        // Step 4: Group by device type
        const deviceStats = await db
        .select({
            deviceType: urlAnalyticsTable.deviceType,
            count: sql`COUNT(*)`,
        })
        .from(urlAnalyticsTable)
        .where(eq(urlAnalyticsTable.urlId, id))
        .groupBy(urlAnalyticsTable.deviceType);

        // Step 5: Group by browser (optional)
        const browserStats = await db
        .select({
            browser: urlAnalyticsTable.browser,
            count: sql`COUNT(*)`,
        })
        .from(urlAnalyticsTable)
        .where(eq(urlAnalyticsTable.urlId, id))
        .groupBy(urlAnalyticsTable.browser);

        // Step 6: Return combined result
        return res.json({
            url: {
                id: url.id,
                shortCode: url.shortCode,
                targetURL: url.targetURL,
            },
            analytics: {
                totalClicks: Number(clicks.total),
                byCountry: countryStats,
                byDevice: deviceStats,
                byBrowser: browserStats,
            },
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return res.status(500).json({ error: error.message });
    }
};