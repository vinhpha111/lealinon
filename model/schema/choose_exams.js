var mongoose = require('mongoose');
var schema = mongoose.Schema;
var choose_exams = schema({
    user_created : [{ type: Schema.Types.ObjectId, ref: 'users' }],
    post : [{ type: Schema.Types.ObjectId, ref: 'post_groups' }],
    scores : Number,
    created_at : Date,
    updated_at : Date
}, {collection : 'choose_exams'});
module.exports = mongoose.model('choose_exams', choose_exams);