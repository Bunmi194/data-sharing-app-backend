import { z } from "zod";

export const validateUserInputOnSignup = z.object({
  name: z.string({
    required_error: "First name is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(5, "Password length must be greater than 5"),
});

export const validateUserInputOnLogin = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(5, "Password length must be greater than 5"),
});
