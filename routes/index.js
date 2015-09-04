'use strict';
var express = require('express');
var router = express.Router();
var _ = require('lodash');

/* GET home page. */
var isValid = function(obj) {
  if(obj != null && obj != undefined) {
    return true;
  }
  return false;
}

var isCookieAvailable = function(cookie) {
  if(!isValid(cookie) || cookie == {}) {
    return false;
  }
  return true;
};

var isNameAvailable = function(name) {
  if(!isValid(name) || name == '') {
    return false;
  }
  return true;
};

router.get('/hello', function(req, res, next) {
  console.log(req.query.name);
  if(!isNameAvailable(req.query.name)) {
    throw new Error('name not found');
  }

  var greeting = 'hello ' + req.query.name + '!';
  var cookies = '';
  console.log(req.cookies);
  if(isCookieAvailable(req.cookies) && _.size(req.cookies) > 0) {
    cookies = ' I can see your cookies are: ' + JSON.stringify(req.cookies);
  }
  res.status(200)
    .send(greeting + cookies);
});

router.post('/teaTime', function(req, res, next) {
  console.log(req.body);
  console.log(req.query);

  if(!isNameAvailable(req.body.name)) {
    throw new Error('name not found');
  }

  var greeting = 'hi ' + req.body.name + '!';
  var cookies = '';

  if(!_.isEmpty(req.cookies) && _.size(req.cookies) > 0) {
    cookies = ' Last time you had '
                + req.cookies.food
                + ' as food and '
                + req.cookies.drink
                + ' as drink. Now you are having '
                + req.body.food
                + ' as food and '
                + req.body.drink
                + ' as drink.';
  }
  res.status(200)
    .cookie('food', req.body.food,
      {expires: new Date(Date.now() + (365 * 24 * 3600 * 1000))})
    .cookie('drink', req.body.drink,
      {expires: new Date(Date.now() + (24 * 3600 * 1000))})
    .send(greeting + cookies);
});

module.exports = router;
