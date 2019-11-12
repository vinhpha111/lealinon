var mongoose = require('mongoose');
var schema = mongoose.Schema;
var essay_answer = schema({
    title : String,
    content : String,
    user : { type: schema.Types.ObjectId, ref: 'users' },
    post : { type: schema.Types.ObjectId, ref: 'post_groups' },
    has_evaluate : {
        type: Boolean,
        default: false,
    },
    evaluate_user : { type: schema.Types.ObjectId, ref: 'users' },
    score : Number,
    comment : String,
    is_draft : {
        type: Boolean,
        default: false,
    },
    created_at : Date,
    updated_at : Date
}, {collection : 'essay_answer'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            essay_answer.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    if (typeof Class['methods'] === 'function') {
        let methods = Class.methods();
        for (let name in methods) {
            essay_answer.methods[name] = methods[name];
        }
    }
    if (typeof Class['postMiddleware'] === 'function') {
        let postMiddlewares = Class.postMiddleware();
        for (let type in postMiddlewares) {
            essay_answer.post(type, postMiddlewares[type]);
        }
    }
    return mongoose.model('essay_answer', essay_answer);
}