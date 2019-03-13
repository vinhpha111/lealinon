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
module.exports = mongoose.model('exam_scores', exam_scores);