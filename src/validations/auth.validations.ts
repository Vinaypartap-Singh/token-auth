import z from "zod";

export const SIGNUP_VALIDATIONS = z
  .object({
    username: z.string({ error: "username is required" }).min(3),
    email: z.email({ error: "valid email is required" }),
    password: z.string({ error: "password is required" }).min(3),
  })
  .strict();

export const LOGIN_VALIDATIONS = z
  .object({
    email: z.email({ error: "valid email is required" }),
    password: z.string({ error: "password is required" }).min(3),
  })
  .strict();
