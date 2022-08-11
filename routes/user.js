const express = require('express');
const router = express.Router();
const functions = require('../config/function');

const userController = require('../controllers/user');

router.get('/ajouter', functions.ensureAuthenticated, userController.ajouterVehicule)
router.post('/vehicule', functions.ensureAuthenticated, userController.creerVehicule)
router.post('/supprimerVehicule/:id', functions.ensureAuthenticated, userController.supprimerVehicule)
router.post('/deconnexion', functions.ensureAuthenticated, userController.deconnexion)

module.exports = router;