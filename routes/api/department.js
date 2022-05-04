const express = require('express');
const router = express.Router();
const boom = require('boom');
const authorization = require('../../validation/authorization');

const Department = require('../../models/Department');

//Add Department
router.post('/add-department', async (req, res, next) => {
  const { name } = req.body;

  const newDepartment = new Department({
    name,
  });
  //Save department
  try {
    const new_department = await newDepartment.save();
    res.json(new_department);
  } catch (err) {
    return next(boom.boomify(err));
  }
});

//Return all department
router.get('/department/data', authorization, async (req, res, next) => {
  try {
    const data = await Department.find({}).select('-__v').sort('-date').limit().exec();
    res.json({ data });
  } catch (err) {
    return next(boom.boomify(err));
  }
});

module.exports = router;
