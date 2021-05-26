const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3001
const baseUrl = `/api/persons/`

app.use(cors())
app.use(express.json())

morgan.token('info', req => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
})

app.use(morgan(':method :url :response-time :info'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get(baseUrl, (req, res) => {
    res.json(persons)
})

app.get(`${baseUrl}:id`, (req, res) => {
    const id = Number(req.params.id)
    let person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
        return
    }

    res.status(404).end()
})

app.delete(`${baseUrl}:id`, (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.post(baseUrl, (req, res) => {
    const generateId = () => {
        const maxId = persons.length > 0
            ? Math.max(...persons.map(n => n.id))
            : 0
        return maxId + 1
    }

    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'empty name'
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'empty number'
        })
    }

    if (persons.some(p => p.name.toLowerCase() === body.name.toLowerCase())) {
        return res.status(400).json({
            error: 'name already exists'
        })
    }

    let newPerson = { ...body, id: generateId() }
    persons = [...persons, newPerson]

    res.json(newPerson)

})

app.get('/info', (req, res) => {
    res.send(`<div>Phonebook has info of ${persons.length} people
            <br>
            <br>
            ${new Date(new Date().toUTCString())}</div>`)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



