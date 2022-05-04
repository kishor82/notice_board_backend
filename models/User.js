const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'User',
    },
    status: {
      type: Boolean,
      default: true,
    },
    acknowledge: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notice' }],
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
