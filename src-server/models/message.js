// mongoosejs.com
const mongoose = require('mongoose')


const messageSchema = mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    message: {
        type: String,
        trim: true,
    },
    conversationId: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
)


const Message = new mongoose.model('Message', messageSchema)

module.exports = Message
