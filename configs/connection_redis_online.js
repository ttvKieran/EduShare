const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: 'kuEo4QYNwQjkqqPpEZG09D733Nh8Qfha',
    socket: {
        host: 'redis-13924.c93.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 13924
    }
});

client.on('error', err => console.log('Redis Client Error', err));

const connectRedis  = async () => {
    await client.connect();
}

connectRedis();

module.exports = { client, connectRedis };