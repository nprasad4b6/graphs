// mongoosejs.com
const mongoose = require('mongoose')

//no need to mention db name separeately like in mongodb file
//mongoose in backend behaves like mongodb only
mongoose.connect(process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        // useCreateIndex: true
    }
)


