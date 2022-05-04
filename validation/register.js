const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput(data, edit = false) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.company = !isEmpty(data.company) ? data.company : '';
  data.department = !isEmpty(data.department) ? data.department : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (Validator.isEmpty(data.department)) {
    errors.department = 'department is required';
  }
  if (Validator.isEmpty(data.company)) {
    errors.company = 'company is required';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  }

  if (!Validator.isEmpty(data.email) && !Validator.isEmail(data.email)) {
    errors.email = 'Your email address is invalid';
  }
  // Password checks
  if (Validator.isEmpty(data.password) && !edit) {
    errors.password = 'Password field is required';
  }

  //Check passwords match
  if (data.password !== data.password2 && !edit) {
    errors.password2 = 'Password do not match';
  }

  //Check pass length
  if (!edit && !Validator.isEmpty(data.password) && data.password.length < 8) {
    errors.password = 'Should be at least eight characters';
  }

  if (edit && data.password) {
    //Check passwords match
    if (data.password !== data.password2) {
      errors.password2 = 'Password do not match';
    }
    //Check pass length
    if (!Validator.isEmpty(data.password) && data.password.length < 8) {
      errors.password = 'Should be at least eight characters';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
