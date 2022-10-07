const express = require('express');
const path = require('path')
const app = express()
const cors = require('cors');
 

const api = require('./routes/Api')



const LaunchesRouter = require('./routes/launches/launches.router');
const planetsRouter = require('./routes/planets/planets.router');


const morgan = require('morgan');



app.use(cors({
    origin: 'http://localhost:3000',
}))
 
app.use(morgan('tiny'))
app.use(express.json())
app.use('/v1', api)




app.use(express.static(path.join(__dirname, '..', 'public')))
app.get('/*', (req,res) =>{
res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})






module.exports = app