const mongoose = require('mongoose');
const NoticeSchema = new mongoose.Schema(
  {
    notice: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    metaData: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const Notice = mongoose.model('Notice', NoticeSchema);

module.exports = Notice;
