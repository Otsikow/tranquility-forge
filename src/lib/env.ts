
import { z } from "zod";

const envSchema = z.object({
  googleAiApiKey: z.string().min(1, { message: "Google AI API key is required" }),
});

const envValidated = envSchema.safeParse({
  googleAiApiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY,
});

if (!envValidated.success) {
  throw new Error(
    `Invalid environment variables: ${envValidated.error.flatten().fieldErrors}`
  );
}

export const env = envValidated.data;
