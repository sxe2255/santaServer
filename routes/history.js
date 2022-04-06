const express = require('express');
const router = express.Router();
const controller = require('../controllers/history');
const passport = require('passport');

router.post('/history', passport.authenticate('jwt', {session: false}), controller.history);
router.post('/addhistory', passport.authenticate('jwt', {session: false}), controller.addhistory);
module.exports = router;

