import mongoose from 'mongoose';

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://notesdb:${password}@atlascluster.iqvqzkp.mongodb.net/phonebook?retryWrites=true&w=majority&appName=AtlasApp`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  id: 12,
  name: "Test",
  number: "11111111",
})

/*person.save().then(result => {
  console.log('new person saved!')
  mongoose.connection.close()
})*/

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})

/*Person.deleteOne( { id: "6524498663719212b5626c1a" } )
.then(function(){
  console.log("Person deleted")
  mongoose.connection.close()
})*/