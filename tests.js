'use strict';

var request = require('supertest')
  , express = require('express');

var app = express();
var url = 'http://localhost:8000';
var redurl = 'http://localhost:8001';

describe('hello endpoint tests', function(){
  var name = 'paul';
  var endpoint = '/hello?name='+name;

  it('just hello', function(done){
    request(url)
      .get(endpoint)
      .expect('Content-Type', /html/)
      .expect(200, 'hello '+name+'!', done);
  });

  it('hello with cookie', function(done) {
    request(url)
      .get(endpoint)
      .set('cookie', 'testcookie=Chocolatey')
      .expect('Content-Type', /html/)
      .expect(200, 'hello ' + name + '! I can see your cookies are: {"testcookie":"Chocolatey"}')
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('hello with nothing should fail', function(done) {
    request(url)
      .get('/hello')
      .expect('Content-Type', /json/)
      .expect(500, done);
  });
});

describe('teaTime endpoint tests', function(){
  var name = 'paul';
  var endpoint = '/teaTime';

  it('just teaTime for paul', function(done){
    request(url)
      .post(endpoint)
      .send({'name': name})
      .expect('Content-Type', /html/)
      .expect(200, 'hi '+name+'!', done);
  });

  var cookie = {};
  it('teaTime with cookie', function(done) {
    request(url)
      .post(endpoint)
      .send({
        'name': name,
        'food': 'burger',
        'drink': 'cola'
      })
      .set('cookie', 'food=junk;drink=brandy')
      .expect('Content-Type', /html/)
      .expect(200, 'hi paul! Last time you had junk as food and brandy as drink. Now you are having burger as food and cola as drink.')
      .expect('set-cookie', /food\=burger.*drink\=cola/)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('teaTime with nothing should fail', function(done) {
    request(url)
      .post('/teaTime')
      .expect('Content-Type', /json/)
      .expect(500, done);
  });
});

describe('proxy endpoint tests', function(){
  var name = 'susan';
  var endpoint = '/';

  it('just proxy', function(done){
    request(redurl)
      .get(endpoint)
      .send({'num1': 10, 'num2': 20})
      .expect('Content-Type', /text/)
      .expect(302, 'Moved Temporarily. Redirecting to http://localhost:8000/hello?name=susan')
      .end(function(err, res) {
        if(err) return done(err);
        done();
      });
  });

  var cookie = {};
  it('just another test', function(done) {
    request(redurl)
      .get(endpoint)
      .send({
        'num1': 20,
        'num2': 30
      })
      .expect('Content-Type', /text/)
      .expect(302, 'Moved Temporarily. Redirecting to http://localhost:8000/hello?name=susan')
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('proxy with nothing should fail', function(done) {
    request(redurl)
      .get(endpoint)
      .expect('Content-Type', /text/)
      .expect(302, done);
  });
});
