const { MongoClient } = require('mongodb');
const assert = require('assert');
const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json');

const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

async function main() {
  const client = new MongoClient(url);

  try {
    await client.connect();

    const results = await circulationRepo.loadData(data);
    assert.equal(results.insertedCount, data.length);

    const getData = await circulationRepo.get();

    assert.equal(getData.length, data.length);
  } catch (error) {
    console.log({ error });
  } finally {
    const admin = client.db(dbName).admin();
    await client.db(dbName).dropDatabase();
    console.log(await admin.listDatabases());
    client.close();
  }
}

main();
