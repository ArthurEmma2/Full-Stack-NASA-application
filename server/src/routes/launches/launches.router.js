const express = require('express');
const { httpgetAllLuanches,  httpAddNewLuanches,abortLaunch} = require('./launches.controller');


const  LaunchesRouter = express.Router()

LaunchesRouter.get('/', httpgetAllLuanches )
LaunchesRouter.post('/', httpAddNewLuanches)
LaunchesRouter.delete('/:id', abortLaunch)


module.exports = LaunchesRouter