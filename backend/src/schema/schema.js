import { z } from "zod";

export const registerSchema = z.object({
  name: z.string({
    required_error: "The name is required",
  }).min(1, {
    message: "Name cannot be empty",
  }),

  lastName: z.string().optional(),

  email: z.string({
    required_error: "The email is required",
  }).email({
    message: "Invalid email format",
  }),

  password: z.string({
    required_error: "The password is required",
  }).min(5, {
    message: "Password must be at least 5 characters",
  }),

  phone: z.string().optional(),
});

export const workerCreateSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }),
  lastName: z.string().optional(),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters" }),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string({
    required_error: "The email is required",
  }).email({
    message: "Invalid email format",
  }),

  password: z.string({
    required_error: "The password is required",
  }).min(5, {
    message: "Password must be at least 5 characters",
  }),
});
