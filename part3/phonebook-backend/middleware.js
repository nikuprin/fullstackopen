import morgan from "morgan";

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

export const tinyLogger = morgan("tiny", {
  skip: (req, _res) => req.method === "POST",
});

export const postLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :body",
  {
    skip: (req, _res) => req.method !== "POST",
  }
);

export const errorHandler = (error, _request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

export const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
