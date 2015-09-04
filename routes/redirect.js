'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
var isValid = function(obj) {
  if(obj != null && obj != undefined) {
    return false;
  }
  return true;
}

var isNumAvailable = function(num) {
  if(isValid(num) && !isNaN(num)) {
    return false;
  }
  return true;
};

router.get('/', function(req, res, next) {
  console.log(req.query);
  if(!isNumAvailable(req.query.num1) && !isNumAvailable(req.query.num2)) {
    throw new Error('name not found');
  }

  var sum = parseInt(req.query.num1) + parseInt(req.query.num2);

  res.cookie('sum', sum)
    .redirect('http://localhost:8000/hello?name=susan');
});

module.exports = router;
