const mongoose = require('mongoose');
const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  metaData: {
    type: Object,
    default: {},
  },
});

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;
