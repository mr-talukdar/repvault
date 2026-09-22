import z from "zod";

export const UserSignupSchema = z.object({
  name: z.string(),
  email: z.email(),
  age: z.number(),
  mobile: z.number(),
  password: z.string().min(4),
});

export const UserLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(4),
});
