'use strict';

const is = require('is'),
      session = require('express-session'),
      RedisStore = require('connect-redis')(session);

module.exports = function($opts) {
    return function($$app, $$resolver) {
        if ($opts.enabled) {
            var client = is.string($opts.resource) ? $$resolver($opts.resource) : $opts.resource;
            $$app.use(session(Object.assign({
                store: new RedisStore({ client: client })
            }, $opts.options)));
        }
    };
};
