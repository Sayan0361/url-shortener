import { createHmac, randomBytes } from "crypto";

export const hashPasswordWithSalt = async(password, userSalt=undefined) =>{
    const salt = userSalt ?? randomBytes(256).toString("hex");
    const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");

    return {
        salt,
        password:hashedPassword
    }
}

export const hmacProcess = async(value,key) =>{
    const result = createHmac("sha256", key)
                    .update(value)
                    .digest("hex")
    return result;
}

export const comparePasswords = async (plainPassword, hashedPassword, salt) => {
    const { password: computedHash } = await hashPasswordWithSalt(plainPassword, salt);
    return crypto.timingSafeEqual(
        Buffer.from(computedHash),
        Buffer.from(hashedPassword)
    );
};