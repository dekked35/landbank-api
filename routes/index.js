var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Landbank API' });
});

router.post('/test',function(req, res, next){
  res.send(req.body.text2)
});

module.exports = router;
