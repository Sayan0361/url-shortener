import { shortenBodySchema } from "../validation/request.validation.js";
import { nanoid } from "nanoid";
import { insertShortCodeIntoTable } from "../services/url.service.js";
import { urlsTable } from "../models/url.model.js";
import { eq } from "drizzle-orm";
import db from "../db/index.js";

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

export const shortCode = async(req,res) => {
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