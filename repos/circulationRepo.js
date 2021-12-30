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
      client.close();
      resolve(results);
    } catch (err) {
      console.log({ err });
    }
  });

  const get = () => {
    const client = new MongoClient(url);

    return new Promise(async (resolve) => {
      try {
        await client.connect();
        const db = client.db(dbName);
        const results = db.collection('newspapers').find();

        resolve(await results.toArray());
      } catch (error) {
        console.log('Error fetching', error);
      }
    });
  };

  return { loadData, get };
};

module.exports = circulationRepo();
