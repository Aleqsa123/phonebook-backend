import {} from 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import Person from './models/person.js';

//Middleware before middleware and routes
const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static('build'));

//Morgan API request logger
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

//Routes
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    const count = persons.length;
    const date = Date();
    response.send(`<p>Phonebook has info for ${count} people</p>
                    <p>${date}</p>`)
  })
  

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  Person.deleteOne( { id: request.params.id } ).then((result)=>{
    console.log("Person deleted", result)
    response.status(204).end()
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    console.log("new person added");
    response.json(savedPerson)
  })
})

/*  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }else if(!body.name){
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }else if(persons.some((person) => person.name.toLowerCase() === body.name.toLowerCase() )){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }*/

//Middleware after routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})