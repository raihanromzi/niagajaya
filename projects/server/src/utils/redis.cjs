const Redis = require("ioredis").default;

const redis = new Redis(process.env.REDIS_URL);

module.exports = redis;
