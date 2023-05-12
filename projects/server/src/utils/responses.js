const cleanObject = require('./cleanObject')

const responseSuccess = (code, status, pagination, data) =>
  cleanObject({
    code,
    status,
    pagination,
    data,
  })

const responseError = (code, status, error) =>
  cleanObject({
    code,
    status,
    errors: error,
  })

module.exports = { responseSuccess, responseError }
