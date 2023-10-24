import {} from 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import Person from './models/person.js';

// Middleware before middleware and routes
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

// Morgan API request logger
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

// Routes

// GET - get info about people DB for today
app.get('/info', (request, response, next) => {
  Person.find({})
    .then((people) => {
      response.send(`<p> Phonebook has info for ${people.length} people</p>
    <p>${Date()}</p>`);
    })
    .catch((error) => next(error));
});

// GET - get all the people from DB
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then((people) => {
    response.json(people);
  })
    .catch((error) => next(error));
});

// GET - get individual person
app.get('/api/persons/:id', (request, response, next) => {
  console.log(request.params.id);
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// DELETE request - removes individual person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      console.log('person deleted successfully');
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// POST - add new person to DB
app.post('/api/persons', (request, response, next) => {
  const { body } = request;

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    console.log('new person added');
    response.json(savedPerson);
  })
    .catch((error) => next(error));
});

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
  } */

// PUT request - changes phone-number of the existing person
app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request;

  const updatedPerson = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, updatedPerson, { new: true })
    .then((updPerson) => {
      response.json(updPerson);
    })
    .catch((error) => next(error));
});

// Middleware after routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

// handler of requests with result to errors -
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
