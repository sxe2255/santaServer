const express = require('express');
const controller = require('../controllers/personal');
const router = express.Router();
const passport = require('passport');

router.post('/personal', passport.authenticate('jwt', {session: false}), controller.owerview);
router.post('/santa', passport.authenticate('jwt', {session: false}), controller.santa);
router.put('/personal/', passport.authenticate('jwt', {session: false}), controller.update);

module.exports = router;