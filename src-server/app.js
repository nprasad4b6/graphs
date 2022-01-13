const express = require('express')
require('./db/mongoose')
const Conversation = require('./models/conversation')
const Message = require('./models/message')
const cors = require('cors')
const app = express()
const path = require('path');
const fs = require('fs')

app.use(express.json())
app.use(cors())

app.get('/conversation/:memberId', async (req, res) => {
    const result = await Conversation.find({
        members: {
            $in: [req.params.memberId]
        }
    })
    res.send(result)
})

app.post('/conversation', async (req, res) => {
    const conversation = new Conversation(req.body)
    const result = await conversation.save()
    res.send(result)
})

app.get('/message/:conversationId', async (req, res) => {
    const result = await Message.find({
        conversationId: req.params.conversationId
    })
    res.send(result)
})

app.post('/message', async (req, res) => {
    const message = new Message(req.body)
    const result = await message.save()
    res.send(result)
})


module.exports = app