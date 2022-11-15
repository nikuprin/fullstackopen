import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import * as mw from "./middleware.js";
import Person from "./models/person.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors());
app.use(express.json());
app.use(mw.tinyLogger);
app.use(mw.postLogger);

app.get("/api/persons", async (request, response) => {
  const result = await Person.find({});
  response.json(result);
});

app.post("/api/persons", async (request, response, next) => {
  try {
    const body = request.body;
    if (!body.name) {
      return response.status(400).json({
        error: "name missing",
      });
    }

    if (!body.number) {
      return response.status(400).json({
        error: "number missing",
      });
    }

    const match = await Person.find({ name: body.name });
    if (match.length > 0) {
      try {
        const person = await Person.findByIdAndUpdate(
          match[0]._id,
          { number: body.number },
          { new: true, runValidators: true }
        );
        return response.json(person);
      } catch (error) {
        next(error);
      }
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    await person.save();
    response.json(person);
  } catch (error) {
    next(error);
  }
});

app.get("/api/persons/:id", async (request, response) => {
  try {
    const person = await Person.findById(request.params.id);
    response.json(person);
    response.status(404).end();
  } catch (error) {
    console.error(error);
  }
});

app.delete("/api/persons/:id", async (request, response) => {
  try {
    await Person.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/info", async (request, response) => {
  try {
    const count = await Person.estimatedDocumentCount();
    response.send(`Phonebook has info for ${count} people</br></br>${Date()}`);
  } catch (error) {
    console.error(error);
    response.status(500);
  }
});

app.use(mw.unknownEndpoint);
app.use(mw.errorHandler);
