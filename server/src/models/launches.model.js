const axios = require('axios')

const launchesDataBase = require('./launches.mongo')
const planets = require('./planets.mongo')


const DEFAULT_FLIGHT_NUMBER = 100

const launch  = {
    flightNumber: 100, //flight_number
    mission: 'kepler Exploration X', //name
    rocket: 'Explorer IS1', //rocket.name
    launchDate: new Date('December 27, 2030'), //date_local
    target: 'Kepler-442 b',   //not applicable
    customers: ['ZTM', 'NASA'], //payload.customers
    upcoming: true, //upcoming
    success: true //success
}

saveLaunch(launch)

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches() {
    const response =  await axios.post(SPACEX_API_URL, {
        query:{}, 
        options:{
            pagination: false,
            populate:[
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    } 
                },{
                    path: 'payloads',
                    select: {
                        'customers':1
                    }
                }
            ]
        }              
})


if(response.status !== 200){
console.log('problem loading launch data')
throw new Error('launch data download failed')
}


const launchDocs = respone.data.docs;
for(const launchDoc of launchDocs){
    const payloads = launchDoc['payloads']
    const customers = payloads.flatMap((payload) => {
        return payload['customers']
    })
    const launch = {
        flightNumber: launchDoc['flight_number'],
        mission: launchDoc['name'],
        rocket: launchDoc['rocket']['name'], 
        launchDate: launchDoc['date_local'],
        upcoming: launchDoc['upcoming'],
        success: launchDoc['success'],
        customers,
    }

    console.log(`${launch.flightNumber} ${launch.mission}`)

    //populate launches collection
    await saveLaunch(launch)
}
}

async function loadLaunchData(){
   const firstLaunch =  await findLaunch({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: "FalconSat",
    })

    if(firstLaunch){
        console.log('launch data already loaded')
        
    }else{
        await populateLaunches()
    }
    
 
}


async function findLaunch(filter){
    return await launchesDataBase.findOne(filter);
}


 async function existLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId
    }) 

}

async function getLatestFlightNumber(){
    const latestLaunch = await launchesDataBase
    .findOne()
    .sort('-flightNumber')

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER
    }

   return latestLaunch.flightNumber;
}

async function getAllLaunches(){
  return launchesDataBase
  .find({},{
    '_id':0, '__v':0})
    .skip(20)
    .limit(50)
}


async function saveLaunch (launch) {
  await launchesDataBase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    },  launch,{
        upsert:true
    })
}


async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target, 
        })
    
        if(!planet){
            throw new Error('No matching planet')
        }
        const newFlightNumber = await getLatestFlightNumber() + 1

    const newLaunch = Object.assign(launch,{
        success: true,
        upcoming:true,
        customers:['Zero to Mastery', 'NASA'],
        flightNumber: newFlightNumber
    });

    await saveLaunch(newLaunch)
}


 




async function abortLaunchById(launchId){
   
    const aborted = await launchesDataBase.updateOne({
        flightNumber: launchId,
    },{
        upcoming: false,
        success: false 
    })


    return  aborted.modifiedCount === 1;

}
 
module.exports = {
    existLaunchWithId,  
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById
}
