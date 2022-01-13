var mongoose = require("mongoose");
var DB;
// if (process.env.environment === 'dev') {
//     DB = process.env.MONGODB_URL_DEV
// } else {
//     DB = process.env.MONGODB_URL_LOCAL
// }
var DB = "mongodb+srv://user2:user2@prasad.5c9fw.mongodb.net/top-ten-api?retryWrites=true&w=majority";
mongoose.connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
}).then(() => {
    console.log('Connection Succesful');
}).catch((e) => {
    console.log(e)
    console.log('No connection');
})
