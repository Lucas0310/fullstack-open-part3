const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')
require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).then(() => {
    console.log('Connected to MongoDB')
}, (error) => {
    console.log('error connecting to MongoDB:', error.message)
})

const phonebookSchema = new mongoose.Schema({
    name: { type: String, minLength: 3, unique: true },
    number: { type: String, minLength: 8 },
})

phonebookSchema.plugin(validator)

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', phonebookSchema)