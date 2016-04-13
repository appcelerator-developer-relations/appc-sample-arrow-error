var _ = require('lodash');

exports.internalServerError = internalServerError;
exports.pageNotFound = pageNotFound;

function internalServerError(err, req, res, next) {

  // allows you to throw or call next() with a string
  if (_.isString(err)) {
    err = {
      message: err
    };
  }

  // default status
  if (!_.has(err, 'status')) {
    err.status = 500;
  }

  // default message
  if (!_.has(err, 'message')) {
    err.message = 'Unknown Error';
  }

  // log to console, leaving out error (stack) for 404's
  req.logger.error('[' + err.status + '] ' + req.originalUrl + (err.status === 404 ? '' : ' Failed With ' + (err.stack || err.message)));

  // already sent response
  if (res.bodyFlushed) {
    return;
  }

  // send status
  res.status(err.status);

  // for XMLHttpRequest
  if (req.xhr) {
    return res.send({
      success: false,
      code: err.code,
      error: err.message
    });
  }

  // probably coming from Arrow API, which we'll leave to the builtin
  if (!req.accepts('html')) {
    return next();
  }

  // add more details in development
  if (req.server.config.env === 'development') {
    err.env = JSON.stringify(req.app.locals, null, 2);
    err.req = JSON.stringify(_.pick(req, '_reqid', 'method', 'path', 'params', 'query', 'body', 'headers', 'cookies'), null, 2);
  }

  // render error template
  req.server.app.render('error', {
    env: req.server.config.env,
    error: err
  }, function(renderErr, html) {

    // send status and rendered template or render error
    res.send(html || renderErr.message, next);
  });
}

function pageNotFound(req, res, next) {

  // no response sent
  if (!res.bodyFlushed) {

    // create a 404 error
    var error = new Error('Page Not Found');
    error.status = 404;

    // pass it on to next to be caught by internalServerError()
    return next(error);
  }

  // business as usual
  next();
}
