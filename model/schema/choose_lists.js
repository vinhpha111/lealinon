var mongoose = require('mongoose');
var schema = mongoose.Schema;
var choose_lists = schema({
    choose_exam : [{ type: Schema.Types.ObjectId, ref: 'choose_exams' }],
    result : Number,
    number_sort : Number,
    created_at : Date,
    updated_at : Date
}, {collection : 'choose_lists'});
module.exports = mongoose.model('choose_lists', choose_lists);