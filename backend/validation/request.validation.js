import { z } from "zod";

export const signupBodySchema = z.object({
    firstname: z.string(),
    lastname: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3)
})

export const loginBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(3)
})

export const shortenBodySchema = z.object({
    url: z.string().url(),
    code: z.string().optional(),
})