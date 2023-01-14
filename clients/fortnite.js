const { Client } = require('@squiddleton/fortnite-api');

const fortniteAPI = new Client({ key: process.env.FNAPIKEY });
module.exports.fortniteAPI = fortniteAPI;