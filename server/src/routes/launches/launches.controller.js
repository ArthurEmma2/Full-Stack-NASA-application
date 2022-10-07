 const { getAllLaunches,scheduleNewLaunch, existLaunchWithId,
     abortLaunchById } = require("../../models/launches.model");

 async function httpgetAllLuanches( req,res) {
res.status(200).json( await getAllLaunches())
console.log(req.query)
}


 const httpAddNewLuanches = async(req,res) => {
    const launch = req.body
    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: "missing required launch properties"
        })
    }
    launch.launchDate = new Date(launch.launchDate)
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error: "invalid launch Date"
        })
    }
   await scheduleNewLaunch(launch)
   console.log(launch)
    return res.status(201).json(launch)
}

const abortLaunch = async  (req,res) =>{
const launchId =  Number(req.params.id) 

const existsLaunch = await existLaunchWithId(launchId)
if(!existsLaunch ){
    return res.status(404).json({
        error: "launch not found"
    })
   
}
const aborted = await abortLaunchById(launchId )
console.log(aborted)
if(!aborted){
    return res.status(400).json({
        error: 'Launch not aborted',
    })

}
return res.status(200).json({
    ok: true, 
})
}

module.exports ={
    httpgetAllLuanches,
    httpAddNewLuanches,
    abortLaunch
    
}