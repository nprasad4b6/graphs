// mongoosejs.com
const mongoose = require('mongoose')
require('./mongooseConnect')

// by mentioning schema in mongoose.schema instead of mongoose.model we can grab 
// middleware functionality of mangoose (i.e we can modfiy before data saves to db)
const portSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        default: 1,

    },
},
    {
        timestamps: true
    }
)


// creating model of User, first letter should be capital (i.e User)
// here we can mention types for fileds, i.e we have more cotrol on fields
const Port = new mongoose.model('Port', portSchema)


async function getData() {
    const data = await Port.find({})
    return data;
    // console.log(data)
}


function InsertData() {
    let data = []
    for (let i = 0; i < 1000; i++) {
        data.push({
            name: "Port1",
            value: Math.random()
        })
    }

    Port.insertMany(data).then(function () {
        console.log("Data inserted")  // Success
    }).catch(function (error) {
        console.log(error)      // Failure
    });
}

// InsertData()
// getData()

module.exports = getData
