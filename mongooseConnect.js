// mongoosejs.com
const mongoose = require('mongoose')

//no need to mention db name separeately like in mongodb file
//mongoose in backend behaves like mongodb only
mongoose.connect("mongodb://127.0.0.1:27017/task-manager",
    {
        useNewUrlParser: true,
        // useCreateIndex: true
    })


