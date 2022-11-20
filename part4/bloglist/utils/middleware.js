import logger from './logger.js';

export const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (error, _request, response, _next) => {
  logger.error(error.message);
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  return response.status(500).end();
};
