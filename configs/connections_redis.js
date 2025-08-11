const { createClient } = require('redis');

const client = createClient({
  url: 'redis://127.0.0.1:6379',
  socket: {
    connectTimeout: 10000, 
    reconnectStrategy: (retries) => {
      console.log(`Reconnect attempt ${retries}`);
      if (retries > 20) return new Error('Max retries reached');
      return Math.min(retries * 200, 5000);
    },
  },
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err.message);
  console.error('Error stack:', err.stack);
});

client.on('connect', () => {
  console.log('Redis Client Connected');
});

client.on('ready', () => {
  console.log('Redis Client Ready');
});

client.on('end', () => {
  console.log('Redis Client Disconnected');
});

const connectRedis = async (retries = 20, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      if (!client.isOpen) {
        console.log(`Attempting to connect to Redis (attempt ${i + 1})...`);
        await client.connect();
        console.log('Redis connected successfully');
      }
      return;
    } catch (err) {
      console.error(`Redis connection attempt ${i + 1} failed:`, err.message);
      if (i === retries - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

client.on('end', async () => {
  console.log('Redis Client Disconnected, attempting to reconnect...');
  await connectRedis();
});

const testPing = async () => {
  try {
    await connectRedis();
    const pong = await client.ping();
  } catch (err) {
    console.error('Ping failed:', err.message);
  }
};

testPing();

module.exports = { client, connectRedis };
