'use strict';
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var querystring = require('querystring')

/* GET home page. */
var isValid = function(obj) {
  if(obj != null && obj != undefined) {
    return true;
  }
  return false;
}

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
  var cookie_text = ' I can see your cookies are: ';
  console.log(req.cookies);
  if((!_.isEmpty(req.cookies) && _.size(req.cookies) > 0)) {
    cookies = cookie_text + JSON.stringify(req.cookies);
  } else if (isNameAvailable(req.query.cookies)){
    cookies = cookie_text + querystring.parse(req.query.cookies, ';', ':');
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
