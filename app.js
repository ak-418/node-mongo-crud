const { MongoClient } = require('mongodb');
const assert = require('assert');
const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json');

const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

async function main() {
  try {
    const client = new MongoClient(url);
    await client.connect();

    const results = await circulationRepo.loadData(data);
    assert.equal(results.insertedCount, data.length);
    const admin = client.db(dbName).admin();
    await client.db(dbName).dropDatabase();
    console.log(await admin.listDatabases());
    client.close();
  } catch (error) {
    console.log({ error });
  }
}

main();
