const express = require('express');
const router = express.Router();
const boom = require('boom');
const authorization = require('../../validation/authorization');

const Company = require('../../models/Company');

//Add Company
router.post('/add-company', async (req, res, next) => {
  const { name } = req.body;

  const newCompany = new Company({
    name,
  });
  //Save Company
  try {
    const new_company = await newCompany.save();
    res.json(new_company);
  } catch (err) {
    return next(boom.boomify(err));
  }
});

//Return all companies
router.get('/company/data', async (req, res, next) => {
  try {
    const data = await Company.find({}).select('-__v').sort('-date').limit().exec();
    res.json({ data });
  } catch (err) {
    return next(boom.boomify(err));
  }
});

module.exports = router;
