var mongoose = require('mongoose');
var schema = mongoose.Schema;
var quiz_answers = schema({
    user : [{ type: Schema.Types.ObjectId, ref: 'users' }],
    post : [{ type: Schema.Types.ObjectId, ref: 'post_groups' }],
    quiz_exam : [{ type: Schema.Types.ObjectId, ref: 'quiz_exams' }],
    number_sort_quiz : Number,//đáp án chọn
    comment : String,
    created_at : Date,
    updated_at : Date
}, {collection : 'quiz_answers'});
module.exports = mongoose.model('quiz_answers', quiz_answers);