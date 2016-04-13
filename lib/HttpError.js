module.exports = HttpError;

function HttpError(status, message, code) {
  this.name = 'HttpError';
  this.status = status;
  this.message = message;
  this.code = code;

  // Pass message so that it's part of the stack, then last trace to this constructor
  this.stack = (new Error(message)).stack.replace(/^    at .+\)\n/m, '');
}

HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;
