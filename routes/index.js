var express = require('express');
var router = express.Router();
const mainController = require('../controllers/main');

router.route('/').get(mainController.home)

router.route('/parcourir').get(mainController.parcourir)
router.route('/parcourir/:type').get(mainController.parcourir)

router.route('/connexion').get(mainController.connexion)
router.route('/connexion').post(mainController.seConnecter)

router.route('/inscription').get(mainController.inscription)
router.route('/inscription').post(mainController.createUser)

router.route('/vehicule/:id').get(mainController.getVehicule)

module.exports = router;