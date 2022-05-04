const express = require('express');
const router = express.Router();
const boom = require('boom');
const authorization = require('../../validation/authorization');

const Notice = require('../../models/Notice');

//Add notice
router.post('/add-notice', async (req, res, next) => {
  const { notice, title, department } = req.body;
  if (!notice) {
    return res.status(400).json({ msg: 'Notice can not be empty!' });
  }
  const newNotice = new Notice({
    notice,
    title,
    department,
  });
  //Save notice
  try {
    const new_notice = await newNotice.save();
    res.json(new_notice);
  } catch (err) {
    return next(boom.boomify(err));
  }
});

//Return all notices by department
router.post('/notice/data', authorization, async (req, res, next) => {
  try {
    const { department } = req.body;
    const noticeCount = await Notice.find({ department }).countDocuments();
    const data = await Notice.find({ department }).sort('-date').limit().exec();
    res.json({ data, noticeCount });
  } catch (err) {
    return next(boom.boomify(err));
  }
});

//Delete notice
router.delete('/notice/:id', authorization, async (req, res, next) => {
  try {
    const data = await Notice.deleteOne({ _id: req.params.id });
    res.json(data);
  } catch (err) {
    return next(boom.boomify(err));
  }
});

// Edit existing notice
router.put('/notice/:id', authorization, async (req, res, next) => {
  try {
    const data = await Notice.updateOne(
      { _id: req.params.id }, // Filter
      { $set: { ...req.body } }, // Update
      { upsert: true } // add document with req.body.id if not exists
    ).exec();
    res.json(data);
  } catch (err) {
    return next(boom.boomify(err));
  }
});

module.exports = router;
