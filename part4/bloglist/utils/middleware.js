import logger from './logger.js';

// eslint-disable-next-line consistent-return
export const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

export default { errorHandler };
