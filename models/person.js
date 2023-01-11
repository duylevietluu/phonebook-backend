const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    unique: true,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: num => {
        const nums = num.split('-')
        if (nums.length == 1) {
          return !isNaN(nums[0])
        }
        else {
          return nums.length == 2 
                  && nums[0].length >= 2 
                  && nums[0].length <= 3 
                  && !isNaN(nums[0]) 
                  && !isNaN(nums[1])
        }
      },
      message: error => `${error.value} is not a valid phone number!`
    },
    required: true,
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
