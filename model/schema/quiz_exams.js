var mongoose = require('mongoose');
var schema = mongoose.Schema;
var quiz_exams = schema({
    user_created : { type: schema.Types.ObjectId, ref: 'users' },
    post : { type: schema.Types.ObjectId, ref: 'post_groups' },
    content: String, // content question
    scores : Number, // core of question
    result : Number, // true in list answer
    created_at : Date,
    updated_at : Date
}, {collection : 'quiz_exams'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            quiz_exams.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    if (typeof Class['methods'] === 'function') {
        let methods = Class.methods();
        for (let name in methods) {
            quiz_exams.methods[name] = methods[name];
        }
    }
    if (typeof Class['postMiddleware'] === 'function') {
        let postMiddlewares = Class.postMiddleware();
        for (let type in postMiddlewares) {
            quiz_exams.post(type, postMiddlewares[type]);
        }
    }
    return mongoose.model('quiz_exams', quiz_exams);
}