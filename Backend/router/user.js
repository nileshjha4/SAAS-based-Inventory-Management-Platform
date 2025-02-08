const express = require('express')
const router = express.Router()
const auth = require('../middlerware/auth')
const user = require('../controller/user')



router.post('/depaul/user',user.addUser)
router.post('/depaul/login',user.login)
router.post('/depaul/academic',auth,user.addAcademic)
router.post('/depaul/grade',auth,user.addGrades)

module.exports = router