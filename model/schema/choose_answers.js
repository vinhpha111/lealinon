var mongoose = require('mongoose');
var schema = mongoose.Schema;
var choose_answers = schema({
    user : [{ type: Schema.Types.ObjectId, ref: 'users' }],
    post : [{ type: Schema.Types.ObjectId, ref: 'post_groups' }],
    choose_exam : [{ type: Schema.Types.ObjectId, ref: 'choose_exams' }],
    number_sort_choose : Number,//đáp án chọn
    created_at : Date,
    updated_at : Date
}, {collection : 'choose_answers'});
module.exports = mongoose.model('choose_answers', choose_answers);