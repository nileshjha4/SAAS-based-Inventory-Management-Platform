const express = require('express')
const router = express.Router()
const auth = require('../middleware/userauth')
const agent = require('../controller/agent')

router.post('/agent/login',agent.login)
router.get('/get-delivery', auth, agent.getDelivery)

module.exports = router