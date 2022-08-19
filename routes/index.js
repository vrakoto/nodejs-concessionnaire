const express = require('express');
const router = express.Router();
const functions = require('../config/function');
const mainController = require('../controllers/main');

router.get('/', mainController.home)

router.get('/parcourir', mainController.parcourir)
router.get('/parcourir/:type', mainController.parcourir)
router.post('/parcourir/:type', mainController.parcourir)

router.get('/connexion', functions.forwardAccessWhileConnected, mainController.connexion)
router.post('/connexion', functions.forwardAccessWhileConnected, mainController.seConnecter)

router.get('/inscription', functions.forwardAccessWhileConnected, mainController.inscription)
router.post('/inscription', functions.forwardAccessWhileConnected, mainController.createUser)

router.get('/vehicule/:id', mainController.getVehicule)
router.get('/utilisateur/:id', mainController.getUtilisateur)

module.exports = router;