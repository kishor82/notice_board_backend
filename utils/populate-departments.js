const boom = require('boom');
const mongoose = require('mongoose');
const Department = require('../models/Department');

const department_data = require('./departments.json');

// DB Config
const db = require('../config/keys').MongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB successfully connected.'))
  .catch((err) => console.log({ err }));

//Add Department
const addDepartment = async ({ name }) => {
  const newDepartment = new Department({
    name,
  });
  //Save Company
  try {
    return await newDepartment.save();
  } catch (err) {
    throw boom.boomify(err);
  }
};

Promise.all(
  department_data.map(async (item) => {
    const data = await addDepartment({ name: item });
    console.log({ data });
    return data;
  })
);
