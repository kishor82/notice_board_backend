const boom = require('boom');
const mongoose = require('mongoose');
const Company = require('../models/Company');
const company_data = require('./companies.json');

// DB Config
const db = require('../config/keys').MongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB successfully connected.'))
  .catch((err) => console.log({ err }));

//Add Company
const addCompany = async ({ name }) => {
  const newCompany = new Company({
    name,
  });
  //Save Company
  try {
    await newCompany.save();
  } catch (err) {
    throw boom.boomify(err);
  }
};

Promise.all(
  company_data.map(async (item) => {
    const data = await addCompany({ name: item });
    console.log({ data });
    return data;
  })
);
