var mongoose = require('mongoose');
var schema = mongoose.Schema;
var quiz_exams = schema({
    user_created : [{ type: Schema.Types.ObjectId, ref: 'users' }],
    post : [{ type: Schema.Types.ObjectId, ref: 'post_groups' }],
    content: String, // content question
    scores : Number, // core of question
    result : Number, // true in list answer
    created_at : Date,
    updated_at : Date
}, {collection : 'quiz_exams'});
module.exports = mongoose.model('quiz_exams', quiz_exams);