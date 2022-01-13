const mongoose = require('mongoose')

const conversationSchema = mongoose.Schema({
    members: {
        type: Array,
        required: true,
    }
}, {
        timestamps: true
    })

const Conversation = new mongoose.model('Conversation', conversationSchema)
module.exports = Conversation