var mongoose = require('mongoose');
var schema = mongoose.Schema;
var quiz_lists = schema({
    quiz_exam : { type: schema.Types.ObjectId, ref: 'quiz_exams' },
    number_sort : Number, // position in list answer
    content : String,
    created_at : Date,
    updated_at : Date
}, {collection : 'quiz_lists'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            quiz_lists.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    if (typeof Class['methods'] === 'function') {
        let methods = Class.methods();
        for (let name in methods) {
            quiz_lists.methods[name] = methods[name];
        }
    }
    if (typeof Class['postMiddleware'] === 'function') {
        let postMiddlewares = Class.postMiddleware();
        for (let type in postMiddlewares) {
            quiz_lists.post(type, postMiddlewares[type]);
        }
    }
    return mongoose.model('quiz_lists', quiz_lists);
}