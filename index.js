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

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

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

// app.put('/api/notes/:id', (request, response, next) => {
//   const body = request.body
//   const note = {
//     content: body.content,
//     important: body.important,
//   }
//   Note.findByIdAndUpdate(request.params.id, note, { new: true })
//     .then(updatedNote => {
//       response.json(updatedNote)
//     })
//     .catch(error => next(error))
// })


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// end middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

// set up
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// flyctl.exe secrets set MONGODB_URI='mongodb+srv://duyle:fullstack@cluster0.i0cihys.mongodb.net/phoneBook?retryWrites=true&w=majority'