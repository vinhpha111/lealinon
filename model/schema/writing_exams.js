var mongoose = require('mongoose');
var schema = mongoose.Schema;
var writing_exams = schema({
    title : String,
    content : String,
    user : [{ type: Schema.Types.ObjectId, ref: 'users' }],
    post : [{ type: Schema.Types.ObjectId, ref: 'post_groups' }],
    avaluate_user : [{ type: Schema.Types.ObjectId, ref: 'users' }],
    score : Number,
    created_at : Date,
    updated_at : Date
}, {collection : 'writing_exams'});
module.exports = mongoose.model('writing_exams', writing_exams);