'use strict';

var should = require('should'),
    sinon = require('sinon'),
    reflekt = require('reflekt'),
    proxyquire = require('proxyquire');

describe('redis', function() {
    beforeEach(function() {
        this.app = { use: sinon.spy() };
        this.resolver = new reflekt.ObjectResolver({ foo: 'foo' });

        this.connectRedisMock = sinon.spy(function() { return function() {}; });
        this.expressSessionMock = sinon.spy();

        this.initializer = proxyquire('./', {
            'connect-redis': this.connectRedisMock,
            'express-session': this.expressSessionMock
        });
    });

    it('should not configure sessions storage if it is disabled', function() {
        this.initializer({ enabled: false })(this.app, this.resolver);
        this.app.use.called.should.equal(false);
    });

    it('should use the configured options', function() {
        this.initializer({ enabled: true, options: { foo: 'foo' } })(this.app, this.resolver);
        this.expressSessionMock.called.should.equal(true);
        this.expressSessionMock.lastCall.args[0].should.have.property('foo', 'foo');
    });

    it('should resolve the resource if the configured resource is a string', function() {
        this.resolver = sinon.spy(this.resolver);
        this.initializer({ enabled: true, resource: 'foo' })(this.app, this.resolver);
        this.resolver.called.should.equal(true);
        this.resolver.calledWith('foo').should.equal(true);
    });
});
