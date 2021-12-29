const { MongoClient } = require('mongodb');

const circulationRepo = () => {
  const url = 'mongodb://localhost:27017';
  const dbName = 'circulation';
  const loadData = (data) => new Promise(async (resolve) => {
    const client = new MongoClient(url);
    try {
      await client.connect();
      const db = client.db(dbName);

      const results = await db.collection('newspapers').insertMany(data);
      resolve(results);
    } catch (err) {
      console.log({ err });
    }
  });

  return { loadData };
};

module.exports = circulationRepo();
