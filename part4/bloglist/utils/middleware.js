import jsonwebtoken from 'jsonwebtoken';
import logger from './logger.js';
import config from './config.js';
import User from '../models/user.js';

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

export const tokenExtractor = (request, _response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }
  next();
};

export const userExtractor = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jsonwebtoken.verify(request.token, config.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }
    request.user = await User.findById(decodedToken.id);
  }
  return next();
};
