require("dotenv").config();
const Person = require("./models/note");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
morgan.token("body", (request, response) => JSON.stringify(request.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  const information = `Phone book has info for ${persons.length} people.`;
  const date = new Date().toString();
  const responseHtml = `
    <div>${information}</div>
    <br>
    <div>${date}</div>
  `;
  response.send(responseHtml);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => response.json(people));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson.save().then(() => {
    response.status(201).json(newPerson.toJSON());
  });
});

app.get("/api/persons/:id", (request, response) => {
  const person = Person.findById(request.params.id);
  person.then((people) => {
    if (!people) {
      response.status(404).end();
    } else {
      response.json(people);
    }
  });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id).then((result) =>
    response.status(204).end()
  );
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
