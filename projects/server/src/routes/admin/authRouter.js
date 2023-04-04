const express = require('express')
const router = express.Router()

const {
  authAdminController,
} = require('../../controllers/admin/auth/authAdminController')
const {
  emailValidator,
  loginValidation,
} = require('../../validations/loginValidation')
const { validate } = require('../../validations/login.cjs')

router.post(
  '/admin/login',
  emailValidator(),
  loginValidation,
  validate,
  authAdminController.login
)

module.exports = router
