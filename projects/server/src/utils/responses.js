const cleanObject = require("./cleanObject");

const responseSuccess = (code, status, data) =>
  cleanObject({
    code,
    status,
    data,
  });

const responseError = (code, status, error) =>
  cleanObject({
    code,
    status,
    errors: error,
  });

module.exports = { responseSuccess, responseError };
