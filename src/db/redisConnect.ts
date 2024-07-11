import { Redis } from "ioredis";

const redis = new Redis({
  port: 6379, // Redis port
  host: "redis", // Redis host from the Docker Compose service name
  password: process.env.REDIS_PASSWORD, // Redis password from your env file
});

export default redis;
