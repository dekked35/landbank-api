var express = require('express');
var router = express.Router();
var PropertyManager = require('../model/propertyManager');

const propertyManager = new PropertyManager();

router.post('/area', function(req, res, next){
  propertyManager.setProperty(req.body.propertyType);
  const area = propertyManager.getArea(req.body);
  res.send(area);
});

router.post('/product', function(req, res, next){
  propertyManager.setProperty(req.body.propertyType);
  const product = propertyManager.getProduct(req.body);
  res.send(product);
});

router.post('/spendings', function(req, res, next){
  propertyManager.setProperty(req.body.propertyType);
  const spendings = propertyManager.getAllSpendings(req.body);
  res.send(spendings);
});

router.post('/implicit-costs', function(req, res, next){
  propertyManager.setProperty(req.body.propertyType);
  const implicitCosts = propertyManager.getImplicitCosts(req.body);
  res.send(implicitCosts);
});

router.post('/profit', function(req, res, next){
  propertyManager.setProperty(req.body.propertyType);
  const profit = propertyManager.getProfit(req.body);
  res.send(profit);
});

router.post('/irr',function(req, res, next){
  propertyManager.setProperty(req.body.propertyType);
  const irr = propertyManager.getIRR(req.body);
  res.send(irr);
});


module.exports = router