var mongoose = require('mongoose');
var schema = mongoose.Schema;
var schedules = schema({
    job: String,
    params: String,
    active_at: Date,
    has_active: {
        type: Boolean,
        default: false
    },
    created_at : Date,
    updated_at : Date
}, {collection : 'schedules'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            schedules.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    if (typeof Class['methods'] === 'function') {
        let methods = Class.methods();
        for (let name in methods) {
            schedules.methods[name] = methods[name];
        }
    }
    if (typeof Class['postMiddleware'] === 'function') {
        let postMiddlewares = Class.postMiddleware();
        for (let type in postMiddlewares) {
            schedules.post(type, postMiddlewares[type]);
        }
    }
    return mongoose.model('schedules', schedules);
}