import { Redis } from "@upstash/redis";
import { env } from "~/env";
const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export async function readCount() {
  return parseInt(
    await redis.get("count").then((value) => value?.toString() || "0"),
  );
}

export async function writeCount(count: number) {
  await redis.set("count", count.toString());
}
