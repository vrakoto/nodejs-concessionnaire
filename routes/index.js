var express = require('express');
var router = express.Router();
const mainController = require('../controllers/main');

/* router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); */

router.route('/').get(mainController.getHome)
router.route('/parcourir').get(mainController.parcourir)

module.exports = router;
