const app = require('./app')

const Port = process.env.PORT || 3000

app.listen(Port, () => {
    console.log(`server listens on port ${Port}`)
})