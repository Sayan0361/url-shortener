import { db } from "../db/index.js"
import { usersTable } from "../models/index.js"
import { loginBodySchema, signupBodySchema } from "../validation/request.validation.js";
import { hashPasswordWithSalt } from "../utils/hash.js";
import { getUserByEmail } from "../services/user.service.js";
import jwt from "jsonwebtoken";

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

        const existingUser = await getUserByEmail(email);
        
        if(existingUser){
            return res.status(400).json({
                error: `User with this email:${email} already exists!`
            })
        }

        const {salt, password:hashedPassword} = hashPasswordWithSalt(password);

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

export const login = async(req,res) =>{
    try{
        const validationResult = await loginBodySchema.safeParseAsync(req.body);
        if(validationResult.error){
            return res.status(400).json({
                error: validationResult.error.format()
            });
        }
        const { email, password } = validationResult.data;

        const user = await getUserByEmail(email);
        
        if(!user){
            return res.status(400).json({
                error: `User with this email doesn't exist!`
            })
        }

        // Hash the provided password with the stored salt
        const { password: hashedInputPassword } = await hashPasswordWithSalt(password, user.salt);

        // Compare the hashed input password with stored hashed password
        if(hashedInputPassword !== user.password){
            return res.status(400).json({
                error: `Invalid password`
            })
        }

        const token = jwt.sign({
            id: user.id,
        }, process.env.JWT_SECRET);

        return res.status(200).json({ 
            success: true,
            message: `Logged in Successfully`,
            data: {
                token
            }
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}