import { eq } from "drizzle-orm";
import { db } from "../db/index.js"
import { usersTable } from "../models/index.js"
import { randomBytes, createHmac } from "crypto";
import { signupBodySchema } from "../validation/request.validation.js";

export const signup = async(req,res) =>{
    // const { firstname, lastname, email, password } = req.body;
    try{
        // validation : /validation/request.validation.js
        const validationResult = await signupBodySchema.safeParseAsync(req.body);
        if(validationResult.error){
            return res.status(400).json({
                error: validationResult.error.format()
            });
        }

        const { firstname, lastname, email, password } = validationResult.data;

        const [existingUser] = await db
            .select({
                id: usersTable.id,
            })
            .from(usersTable)
            .where(eq(usersTable.email, email));
        
        if(existingUser){
            return res.status(400).json({
                error: `User with this email:${email} already exists!`
            })
        }

        const salt = randomBytes(256).toString("hex");
        const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");


        const [user] = await db
            .insert(usersTable)
            .values({
                email,
                firstname,
                lastname,
                password:hashedPassword,
                salt,
            }).returning({
                id:usersTable.id,
                email:usersTable.email
            });

        return res.status(201).json({
            success: true,
            message: `User created with this email:${email}`,
            data: {
                userId: user.id
            }
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}