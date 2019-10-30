var baseModel = require('./base');
var model = require('./index');
class chatMessage extends baseModel {
    constructor(){
        super('chat_messages');
    }

    listMessage(fromId, toId, exceptIds = []) {
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
            ],
            _id: {
                $nin: exceptIds
            }
        }, null, {
            limit: 10,
            sort:{
                created_at: -1
            }
        });
        return list;
    }
}

module.exports = chatMessage;