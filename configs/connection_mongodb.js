const mongoose = require("mongoose");

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDb Connected`);
    } catch (error) {
        console.log("Connect MongoDb Error!");
    } 
    process.on('SIGINT', async () => {
        await mongoose.disconnect();
        console.log("MongoDB disconnected");
        process.exit(0);
    });
}