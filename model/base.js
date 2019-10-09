class baseModel {
    constructor(model){
        this.model = require('./schema/'+model)(this);
    }

    add(data){
        return new Promise((resolve, reject)=>{
            let item = new this.model(data);
            item.save((err) => {
                if (err) resolve(null);
                resolve(item);
            })
        })
    }

    update(filter, data, callback = null) {
        return this.model.update(filter, data, callback);
    }

    find(query, field_select = null, action = null){
        return new Promise((resolve, reject) => {
            this.model.find(query, field_select, action, (err, items) => {
                if (err) resolve(null);
                resolve(items);
            })
        });
    }

    findOne(query, field_select = null){
        return new Promise((resolve, reject) => {
            this.model.findOne(query, field_select, (err, item) => {
                if (err) {
                    resolve(null);
                }
                resolve(item);
            })
        });
    }

    
}

module.exports = baseModel;