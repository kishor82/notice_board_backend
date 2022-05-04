const mongoose = require('mongoose');
const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  metaData: {
    type: Object,
    default: {},
  },
});

const Department = mongoose.model('Department', DepartmentSchema);

module.exports = Department;
