const LaunchesRouter = require('./launches/launches.router');
const planetsRouter = require('./planets/planets.router');

const express = require('express')

const api = express.Router()


api.use('/planets', planetsRouter)

api.use('/launches', LaunchesRouter)


module.exports = api