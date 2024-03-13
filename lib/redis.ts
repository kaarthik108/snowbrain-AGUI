import { Redis } from "@upstash/redis";

if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
  throw new Error(
    "Please link a KV instance or populate `UPSTASH_REDIS_URL` and `UPSTASH_REDIS_TOKEN`",
  );
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});
