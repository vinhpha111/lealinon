var mongoose = require('mongoose');
var schema = mongoose.Schema;
var quiz_answers = schema({
    user : { type: schema.Types.ObjectId, ref: 'users' },
    post : { type: schema.Types.ObjectId, ref: 'post_groups' },
    quiz_exam : { type: schema.Types.ObjectId, ref: 'quiz_exams' },
    number_sort_quiz : Number,//đáp án chọn
    comment : String,
    created_at : Date,
    updated_at : Date
}, {collection : 'quiz_answers'});

module.exports = function(Class = null){
    if (typeof Class['virtual'] === 'function') {
        let vituals = Class.virtual();
        for (let nameVirtual in vituals) {
            quiz_answers.virtual(nameVirtual).get(vituals[nameVirtual].get).set(vituals[nameVirtual].set);
        }
    }
    return mongoose.model('quiz_answers', quiz_answers);
}