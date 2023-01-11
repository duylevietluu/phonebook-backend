const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Please provide arguments as: node mongo.js <password> [name number]')
  process.exit(1)
}

const password = process.argv[2]

// set up person schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

// connect to server
const url = `mongodb+srv://duyle:${password}@cluster0.i0cihys.mongodb.net/phoneBook?retryWrites=true&w=majority`
mongoose.connect(url).catch((err) => console.log(err))

// add new person
if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        return mongoose.connection.close()
    })
}
// show all people
else {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}
