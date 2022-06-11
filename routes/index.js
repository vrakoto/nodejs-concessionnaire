var express = require('express');
var router = express.Router();
const mainController = require('../controllers/main');
const userController = require('../controllers/user');
const vehiculeController = require('../controllers/vehicule');

router.route('/').get(mainController.home)
router.route('/parcourir').get(mainController.parcourir)
router.route('/connexion').get(mainController.connexion)
router.route('/connexion').post(userController.seConnecter)

router.route('/inscription').get(mainController.inscription)
router.route('/inscription').post(userController.createUser)

router.route('/vendreVehicule').get(mainController.vendreVehicule)

router.route('/vehicule/:id').get(vehiculeController.getVehicule)
router.route('/vehicule').post(vehiculeController.createVehicule)

router.route('/deconnexion').get(userController.deconnexion)

module.exports = router;