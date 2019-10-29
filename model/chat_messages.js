var baseModel = require('./base');
var model = require('./index');
class chatMessage extends baseModel {
    constructor(){
        super('chat_messages');
    }

    listMessage(fromId, toId) {
        let list = this.getModel()
        .find({
            $or: [
                {
                    from: fromId,
                    to: toId
                }, {
                    from: toId,
                    to: fromId
                }
            ]
        });
        return list;
    }
}

module.exports = chatMessage;