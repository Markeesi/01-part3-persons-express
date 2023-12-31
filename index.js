const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(morgan((tokens, req, res) => {
  const requestData = [
    `Method: ${tokens.method(req, res)}`,
    `URL: ${tokens.url(req, res)}`,
    `Status: ${tokens.status(req, res)}`,
    `Response Time: ${tokens['response-time'](req, res)} ms`
  ];

  if (req.method === 'GET') {
    requestData.push(`Query Params: ${JSON.stringify(req.query)}`);
  } else {
    requestData.push(`Request Body: ${JSON.stringify(req.body)}`);
  }

  return requestData.join(' - ');
}));

app.use(express.json())

let persons = 
     [
      {
        "name": "Arto Hellas",
        "number": "050-123456",
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
      },
      {
        "name": "Kukkis",
        "number": "13213214",
        "id": 5
      }
    ]
  

app.get('/info', (req, res) => {
    const personsCount = persons.length;
    res.send(`<h1>This phonebook has info for ${personsCount} people.</h1>`)
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
      } else {
        response.status(404).end({ error: 'name must be unique' })
      }

  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    person = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }




 app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
    }

    const nameExists = persons.some(person => person.name === body.name);
  
    if (nameExists) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      });
    }


  const person = {
    name: body.name || false,
    number: body.number || false,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

  
  const PORT = process.env.port || 8080
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })