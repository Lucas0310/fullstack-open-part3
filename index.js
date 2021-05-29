require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT
const baseUrl = `/api/persons/`
const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

morgan.token('info', req => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
})


app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :response-time :info'))

app.get(baseUrl, (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons)
    })
})

app.get(`${baseUrl}:id`, (req, res, next) => {
    Person.findById(req.params.id).then((person) => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete(`${baseUrl}:id`, (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then(() => {
        res.status(204).end()
    }).catch(error => next(error))
})

app.post(baseUrl, (req, res, next) => {

    const body = req.body

    if (!body.name) {
        return res.status(400).json({ error: 'empty name' })
    }

    if (!body.number) {
        return res.status(400).json({ error: 'empty number' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(newPerson => newPerson.toJSON())
        .then(formattedPerson => res.json(formattedPerson))
        .catch(error => next(error))
})

app.put(`${baseUrl}:id`, (req, res, next) => {
    const body = req.body

    const personToUpdate = { name: body.name, number: body.number }
    const options = { runValidators: true, new: true, context: 'query' }
    Person.findByIdAndUpdate(req.params.id, personToUpdate, options).then(person => {
        res.json(person)
    }).catch(error => next(error))
})

app.get('/info', (req, res) => {
    Person.countDocuments({}).then((persons) => {
        res.send(`<div>Phonebook has info of ${persons} people
    <br>
    <br>
    ${new Date(new Date().toUTCString())}</div>`)
    })

})

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



