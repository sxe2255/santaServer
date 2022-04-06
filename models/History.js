const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userHistorySchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    userWhoGetGift_id: {
        type: String,
        required: true,

    },
    userWhoGetGift_firstName: {
        type: String,
        required: true,

    },
    userWhoGetGift_lastName: {
        type: String,
        required: true,

    },
    date: {
        type: Date,
        required: true,
    }
})
module.exports = mongoose.model('hystorys',userHistorySchema);