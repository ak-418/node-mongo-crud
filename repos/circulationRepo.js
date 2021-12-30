const { MongoClient, ObjectID } = require('mongodb');

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
      client.close();
    } catch (err) {
      console.log({ err });
    }
  });

  const get = (query, limit) => {
    const client = new MongoClient(url);

    return new Promise(async (resolve) => {
      try {
        await client.connect();
        const db = client.db(dbName);
        let results = db.collection('newspapers').find(query);
        if (limit) {
          results = results.limit(limit);
        }

        resolve(await results.toArray());
        client.close();
      } catch (error) {
        console.log('Error fetching', error);
      }
    });
  };

  const getById = (id) => {
    const client = new MongoClient(url);
    return new Promise(async (resolve) => {
      await client.connect();
      const db = client.db(dbName);
      const results = db.collection('newspapers').findOne({ _id: ObjectID(id) });
      resolve(results);
      client.close();
    });
  };

  const addItem = (item) => {
    const client = new MongoClient(url);
    return new Promise(async (resolve) => {
      await client.connect();
      const db = client.db(dbName);
      const result = await db.collection('newspapers').insertOne(item);
      resolve(result.ops);
      client.close();
    });
  };

  const updateItem = (id, updated) => {
    const client = new MongoClient(url);
    return new Promise(async (resolve) => {
      await client.connect();
      const db = client.db(dbName);
      const result = await db.collection('newspapers').findOneAndReplace({ _id: ObjectID(id) }, updated, { returnOriginal: false });
      resolve(result.value);
      client.close();
    });
  };

  return {
    loadData, get, getById, addItem, updateItem,
  };
};

module.exports = circulationRepo();
