const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);
const redis = require('../configs/connection_redis_online');

exports.generateToken = async (payload) => {
    try {
        return await sign(
            {
                payload,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                algorithm: 'HS256',
                expiresIn: process.env.ACCESS_TOKEN_LIFE,
            },
        );
    } catch (error) {
        console.log(`Error in generate access token:  + ${error}`);
        return null;
    }
};

exports.generateRefreshToken = async (payload) => {
    try {
        const refreshToken = await sign(
            {
                payload,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                algorithm: 'HS256',
                expiresIn: process.env.REFRESH_TOKEN_LIFE,
            },
        );
        // await redis.client.set(payload._id.toString(), refreshToken);
        // await redis.client.expire(payload._id.toString(), 365 * 24 * 60 * 60);
        return refreshToken;
    } catch (error) {
        console.log(`Error in generate refresh token:  + ${error}`);
        return null;
    }
};

exports.verifyToken = async (token, secretKey) => {
    try {
        return await verify(token, secretKey, {
            // ignoreExpiration: true,
        });
    } catch (error) {
        console.log(`Error in verify access token: ${error}`);
        return null;
    }
};

exports.verifyRefreshToken = async (refreshToken) => {
    try {
        console.log("RT", refreshToken);
        const payload = await verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log(payload);
        const reply = await redis.client.get(`refreshToken:${payload.payload}`);
        if (`"${refreshToken}"` == reply) {
            return payload;
        }
        console.log(`Error in redis refresh token`);
        return null;
    } catch (err) {
        console.log(`Error in verify refresh token: ${err}`);
        return null;
    }
};