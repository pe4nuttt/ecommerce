'use strict';

const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const connectString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.wbgzw7i.mongodb.net/shopDev`;
console.log('USERNAME:: ', process.env.DB_USERNAME);

const TestSchema = new mongoose.Schema({
  name: String,
});

const Test = mongoose.model('Test', TestSchema);

describe('Mongoose Connection', () => {
  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(connectString);
  });

  // Close the connection to mongoose
  afterAll(async () => {
    await connection.disconnect();
  });

  it('Should connect to Mongoose', () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it('Should save the document to the database', async () => {
    const user = new Test({
      name: 'User-Test',
    });
    await user.save();
    expect(user.isNew).toBe(false);
  });

  it('Should find a document', async () => {
    const user = await Test.findOne({
      name: 'User-Test',
    });
    expect(user).toBeDefined();
  });
});
