import { db } from "../db/index.js"
import { usersTable } from "../models/index.js"
import { loginBodySchema, signupBodySchema } from "../validation/request.validation.js";
import { hashPasswordWithSalt } from "../utils/hash.js";
import { getUserByEmail } from "../services/user.service.js";
import { createUserToken } from "../utils/token.js";

export const signup = async(req,res) =>{ 
    try{
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

        const {salt, password: hashedPassword} = await hashPasswordWithSalt(password);

        const [user] = await db
            .insert(usersTable)
            .values({
                firstname,     
                lastname,    
                email,
                password: hashedPassword,
                salt,
            })
            .returning({
                id: usersTable.id,
                email: usersTable.email
            });

        if (!user) {
            throw new Error('Failed to create user');
        }

        return res.status(201).json({
            success: true,
            message: `User created with this email: ${email}`,
            data: {
                userId: user.id
            }
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ 
            error: error.message || 'Failed to create user' 
        });
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
            });
        }

        const { password: hashedInputPassword } = await hashPasswordWithSalt(password, user.salt);

        if(hashedInputPassword !== user.password){
            return res.status(400).json({
                error: `Invalid password`
            });
        }

        const token = await createUserToken({
            id: user.id,
        });

        // Set cookie with proper spacing after 'Bearer'
        res.cookie("Authorization", `Bearer ${token}`, {
            expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict'
        });
        
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
        return res.status(500).json({ error: error.message });
    }
}

export const logout = async(req,res) =>{
    try{
        res.clearCookie("Authorization")
            .status(200)
            .json({
                success: true,
                message: "Logged out successfully",
            })
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}