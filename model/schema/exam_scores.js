var mongoose = require('mongoose');
var schema = mongoose.Schema;
var exam_scores = schema({
    user : [{ type: Schema.Types.ObjectId, ref: 'users' }],
    post : [{ type: Schema.Types.ObjectId, ref: 'post_groups' }],
    score : Number,
    true_count : Number,
    false_count : Number,
    created_at : Date,
    updated_at : Date
}, {collection : 'exam_scores'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            exam_scores.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    return mongoose.model('exam_scores', exam_scores);
}