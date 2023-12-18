const router = require('express').Router();
const { notFound, errHandler } = require('../middlewares/errHandler');
const userRouter = require('./user');

const initRoutes = (app) => {
    app.use('/api/user', userRouter);

    app.use(notFound);
    app.use(errHandler);
};

module.exports = initRoutes;
