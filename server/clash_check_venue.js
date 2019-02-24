// import from mongo.js 
const Mongo = require('../mongo');
const VenueUtil = Mongo.VenueUtil;

var clashCheckVenue = function(req, res, next){


    console.log('PUT Request for clash check of venue\n');
    console.log("Request Body: " + JSON.stringify(req.body));

    VenueUtil.findOne({'venue': req.body.venue, 'acad_yr': req.body.acad_yr, 'sem': req.body.sem})
    .then(function(venueSchedule){
        let schedules = venueSchedule.scheduled_time;

        let msg = [];

        for(let i=0; i<schedules.length; i++){

            let start_time = schedules[i].start_time;
            let end_time = schedules[i].end_time;
            let week = schedules[i].week;

            for(let j=i+1; j<schedules.length; j++){
                let st = schedules[j].start_time;
                let et = schedules[j].end_time;
                let wk = schedules[j].week;

                if((st<start_time && et>start_time) || (st>=start_time && st<end_time)){
                    // possible clash 
                    let clash_week = [];
                    week.forEach(ele => {
                        if(wk.indexOf(ele)>-1){
                            clash_week.push(ele);
                        }
                    });
                    
                    // clash detected
                    if(clash_week.length>0){
                        msg.push("Clash detected for group " + schedules[i].group + " and " + schedules[j].group + " on week [" + clash_week + "].\n");
                    }
                }
            }
        }

        res.json({msg: msg});

    }).catch(next);


}

module.exports = {
    clashCheckVenue: clashCheckVenue
};