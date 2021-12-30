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

    const filterData = await circulationRepo.get({ Newspaper: getData[4].Newspaper });
    assert.deepEqual(filterData[0], getData[4]);

    const limitData = await circulationRepo.get({}, 4);
    assert.deepEqual(limitData.length, 4);

    const id = getData[0]._id.toString();
    const byId = await circulationRepo.getById(id);
    assert.deepEqual(getData[0], byId);

    const newItem = {
      Newspaper: 'My Own thing',
      'Daily Circulation, 2004': 2192,
      'Daily Circulation, 2013': 1674,
      'Change in Daily Circulation, 2004-2013': 24000,
      'Pulitzer Prize Winners and Finalists, 1990-2003': 10,
      'Pulitzer Prize Winners and Finalists, 2004-2014': 10,
      'Pulitzer Prize Winners and Finalists, 1990-2014': 20,
    };

    const insertedItem = await circulationRepo.addItem(newItem);
    const insertedItemById = await circulationRepo.getById(insertedItem[0]._id);

    assert.deepEqual(newItem, insertedItemById);
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
