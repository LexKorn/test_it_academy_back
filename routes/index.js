const Router = require('express');
const router = new Router();

const ticketRouter = require('./ticketRouter');

router.use('/tickets', ticketRouter);

module.exports = router;