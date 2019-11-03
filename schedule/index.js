var model = require('../model');
var scheduleModel = model.getInstance('schedules');
const fs = require("fs");
var datetime = require('node-datetime');
var pastDateTime = datetime.create();

class schedule {
    constructor(){
        (async () => {
            this.actions = {};
            let listSchedule = await scheduleModel.getModel().find({has_active: false});
            for(let i in listSchedule) {
                let jobFunc = listSchedule[i].job;
                let pathJob = __dirname+'/job/'+jobFunc;
                if (fs.existsSync(pathJob)) {
                    let params = null;
                    if (listSchedule[i].params) {
                        params = listSchedule[i].params.split('|');
                    }
                    let activeAt = (new Date(listSchedule[i].active_at)).getTime();
                    let now = pastDateTime.now();

                    let distanceTime = activeAt - now;

                    if (distanceTime > 0) {
                        this.actions[listSchedule[i]._id] = setTimeout(() => {
                            require(pathJob)(params);
                            this.cancel(listSchedule[i]._id);
                        }, distanceTime);   
                    }
                }
            }
        })()
    }

    async add(jobName, params, time) {
        let paramString = null;
        if (params) {
            paramString = params.join('|');
        }
        let schedule = await scheduleModel.add({
            job: jobName,
            params: paramString,
            active_at: time,
            created_at : pastDateTime.now(),
            updated_at : pastDateTime.now(),
        });

        let jobFunc = jobName;
        let pathJob =  __dirname+'/job/'+jobFunc;
        if (fs.existsSync(pathJob)) {
            let activeAt = time;
            let now = pastDateTime.now();
            let distanceTime = activeAt - now;
            if (distanceTime > 0) {
                this.actions[schedule._id] = setTimeout(() => {
                    require(pathJob)(params);
                    this.cancel(schedule._id);
                }, distanceTime);
                return schedule._id;
            }
        }
    }

    async cancel(scheduleId) {
        await scheduleModel.getModel().deleteOne({_id: scheduleId});
        clearTimeout(this.actions[scheduleId]);
    }
}

module.exports = schedule;