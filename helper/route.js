var jwt = require('jsonwebtoken');
module.exports = {
    base_url : function(url) {
        return process.env.BASE_URL+(url ? '/'+url : '');
    },

    get_item : function(obj, key, def = '') {
        return obj ? obj[key] : def;
    },
}