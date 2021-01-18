const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    userid: { type: String, required: true },
    message: {
        sender: { type: String, required: true },
        receivers: { type: [String] },
        text: { type: String },
        datetime: {type:Date,required:true}         
    }
});


module.exports = mongoose.model('Message',MessageSchema);