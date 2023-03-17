const cleanObject = require("./cleanObject");

const responseSuccess = (code, status, data) =>
  cleanObject({
    code: code,
    status: status,
    data: [data],
  });

const responseError = (code, status, error) =>
  cleanObject({
    code: code,
    status: status,
    errors: error,
  });

module.exports = { responseSuccess, responseError };
