var express = require('express');
var router = express.Router();
var PropertyManager = require('../model/propertyManager');

const propertyManager = new PropertyManager();

router.post('/area', function(req, res, next){
  propertyManager.setProperty(req.body.propertyType);
  const area = propertyManager.getArea(req.body);
  res.send(area);
});

module.exports = router