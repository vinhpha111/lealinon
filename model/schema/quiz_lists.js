var mongoose = require('mongoose');
var schema = mongoose.Schema;
var quiz_lists = schema({
    quiz_exam : [{ type: Schema.Types.ObjectId, ref: 'quiz_exams' }],
    number_sort : Number, // position in list answer
    content : String,
    created_at : Date,
    updated_at : Date
}, {collection : 'quiz_lists'});
module.exports = mongoose.model('quiz_lists', quiz_lists);