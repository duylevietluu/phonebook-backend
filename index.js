const { response } = require('express')
const express = require('express')
const cors = require('cors')
// const morgan = require('morgan')
const app = express()

require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())

// morgan.token('body', (request, response) => 
//   (request.method === 'POST') ?
//     JSON.stringify(request.body)
//     : ""
// )
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())
app.use(express.static('build'))

// database
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// functions
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`<div>Phonebook has info for ${persons.length} people.</div>
    <div>${new Date()}</div>`)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  // if (persons.find(person => person.name === body.name)) {
  //   return response.status(400).json({ 
  //     error: 'name must be unique' 
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  // persons = persons.concat(person)
  // response.json(person)

  person.save()
    .then(() => {
      response.json(person)
    })
    .catch((error) => {
      return response.status(400).json({ 
        error: error.message
      })
    })
})

// set up
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// flyctl.exe secrets set MONGODB_URI='mongodb+srv://duyle:fullstack@cluster0.i0cihys.mongodb.net/phoneBook?retryWrites=true&w=majority'