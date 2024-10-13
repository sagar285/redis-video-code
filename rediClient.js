const redis = require('redis');

const client = redis.createClient(
    {
        url: 'redis://default:HwFRfjlToNeKFvqKVK8ob4mMEURyptrO@redis-19555.c56.east-us.azure.redns.redis-cloud.com:19555'
    }
);

client.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.log('Error connecting to Redis', err);
});

module.exports = client;