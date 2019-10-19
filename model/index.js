class Model {
    static getInstance(model){
        return new (require('./'+model))();
    }
}

module.exports = Model