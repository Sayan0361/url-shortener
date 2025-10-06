import { db } from "../db/index.js"
import { usersTable } from "../models/index.js"
import { acceptCodeSchema, loginBodySchema, signupBodySchema } from "../validation/request.validation.js";
import { hashPasswordWithSalt, hmacProcess } from "../utils/hash.js";
import { getUserByEmail } from "../services/user.service.js";
import { createUserToken } from "../utils/token.js";
import { transport } from "../middlewares/sendMail.js";
import { eq } from "drizzle-orm";

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

export const sendVerificationCode = async(req,res) => {
    try{
        const {email} = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        // Fetch the user by email
        const [user] = await db
            .select({
                id: usersTable.id,
                email: usersTable.email,
                verified: usersTable.verified,
            })
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with this email (${email}) doesn't exist.`,
            });
        }

        if (user.verified) {
            return res.status(400).json({
                success: false,
                message: "User is already verified.",
            });
        }
        // Generate a 6-digit verification code
        const codeValue = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the code before storing
        const hashedCodeValue = await hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);

        // Update user with verification details
        await db
        .update(usersTable)
        .set({
            verificationCode: hashedCodeValue,
            verificationCodeValidation: Math.floor(Date.now() / 1000), // store Unix time
        })
        .where(eq(usersTable.email, email));

        // Send email using Nodemailer
        const info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: email,
            subject: "Your Verification Code",
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                <h2>Your Verification Code</h2>
                <p style="font-size: 22px; font-weight: bold;">${codeValue}</p>
                <p>This code will expire in 5 minutes.</p>
                </div>
            `,
        });

        if (info.accepted.includes(email)) {
            return res.status(200).json({
                success: true,
                message: "Verification code sent successfully to your email.",
            });
        } 
        else {
            return res.status(400).json({
                success: false,
                message: "Failed to send verification email.",
            });
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export const verifyVerificationCode = async(req,res) => {
    try{
        const validationResult = await acceptCodeSchema.safeParseAsync(req.body);
        if(validationResult.error){
            return res.status(400).json({
                error: validationResult.error.format()
            });
        }
        const {email, providedCode} = validationResult.data;
        const code = providedCode.toString();

        // Fetch the user by email
        const [user] = await db
            .select({
                id: usersTable.id,
                email: usersTable.email,
                verified: usersTable.verified,
                verificationCode: usersTable.verificationCode,
                verificationCodeValidation: usersTable.verificationCodeValidation,
            })
            .from(usersTable)
            .where(eq(usersTable.email, email));
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with this email (${email}) doesn't exist.`,
            });
        }

        if (user.verified) {
            return res.status(400).json({
                success: false,
                message: "User is already verified.",
            });
        }

        // Check if verification fields exist
        if (!user.verificationCode || !user.verificationCodeValidation) {
            return res.status(400).json({
                success: false,
                message: "Verification code not found or invalid.",
            });
        }

        // Check if code expired (5 min = 300 seconds)
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime - user.verificationCodeValidation > 5 * 60) {
            return res.status(400).json({
                success: false,
                message: "Sir, what were you doing all this time? Verification code has expired!!",
            });
        }
        // Hash the provided code for comparison
        const hashedCodeValue = await hmacProcess(code, process.env.HMAC_VERIFICATION_CODE_SECRET);

        if (hashedCodeValue === user.verificationCode) {
            // Update user as verified and clear codes
            await db
                .update(usersTable)
                .set({
                    verified: true,
                    verificationCode: null,
                    verificationCodeValidation: null,
                    updatedAt: new Date(),
                })
                .where(eq(usersTable.email, email));
            
            return res.status(200).json({
                success: true,
                message: "Your account has been verified successfully.",
            });
        }
        else{
            return res.status(400).json({
                success: false,
                message: "Invalid verification code.",
            });
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}