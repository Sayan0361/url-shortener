import { shortenBodySchema } from "../validation/request.validation.js";
import { nanoid } from "nanoid";
import { insertShortCodeIntoTable } from "../services/url.service.js";
import { urlsTable } from "../models/url.model.js";
import { and, eq } from "drizzle-orm";
import db from "../db/index.js";
import { success } from "zod";

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

export const getTargetURL = async(req,res) => {
    try{
        const code = req.params.shortCode;

        const [ result ] = await db.select({
            targetURL: urlsTable.targetURL,
        }).from(urlsTable).where(eq(urlsTable.shortCode, code));

        if(!result) return res.status(404).json({
            error: `Invalid URL`
        })

        return res.redirect(result.targetURL);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: error.message });
    }

}

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
        
        // First check if the URL exists and belongs to the user
        const [existingURL] = await db
            .select()
            .from(urlsTable)
            .where(
                and(
                    eq(urlsTable.id, id),
                    eq(urlsTable.userId, req.user.id)
                )
            );

        if (!existingURL) {
            return res.status(404).json({
                error: "URL not found or you don't have permission to delete it"
            });
        }

        // Perform the delete operation
        const result = await db
            .delete(urlsTable)
            .where(
                and(
                    eq(urlsTable.id, id),
                    eq(urlsTable.userId, req.user.id)
                )
            );

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