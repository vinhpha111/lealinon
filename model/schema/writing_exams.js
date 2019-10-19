var mongoose = require('mongoose');
var schema = mongoose.Schema;
var writing_exams = schema({
    title : String,
    content : String,
    user : [{ type: Schema.Types.ObjectId, ref: 'users' }],
    post : [{ type: Schema.Types.ObjectId, ref: 'post_groups' }],
    evaluate_user : [{ type: Schema.Types.ObjectId, ref: 'users' }],
    score : Number,
    created_at : Date,
    updated_at : Date
}, {collection : 'writing_exams'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            writing_exams.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    return mongoose.model('writing_exams', writing_exams);
}