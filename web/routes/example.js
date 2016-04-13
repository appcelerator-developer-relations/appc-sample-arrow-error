var Arrow = require('arrow');
var HttpError = require('lib/HttpError');

module.exports = Arrow.Router.extend({
  name: 'example',
  path: '/example',
  method: 'GET',
  description: 'this is an api that demonstrates our custom error handling',
  parameters: {
    action: {
      description: 'set to throw, next or render',
      optional: true,
      default: 'render',
      type: 'query'
    },
    type: {
      description: 'set to Error, HttpError, Object or String',
      optional: true,
      default: 'String',
      type: 'query'
    }
  },
  action: function(req, resp, next) {
    var e;

    if (req.query.type === 'Error') {
      e = new Error('My Error Message');
    } else if (req.query.type === 'HttpError') {
      e = new HttpError(401, 'Unauthorized');
    } else if (req.query.type === 'Object') {
      e = {
        message: 'Payment Required',
        status: 402
      };
    } else {
      e = 'My Error Message';
    }

    if (req.query.action === 'throw') {
      throw e;
    } else if (req.query.action === 'next') {
      return next(e);
    } else {
      resp.render('example');
      return next();
    }
  }
});
