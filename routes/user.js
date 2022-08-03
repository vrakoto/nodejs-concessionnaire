var express = require('express');
var router = express.Router();
const userController = require('../controllers/user');

function ensureAuthenticated(req, res, next) {
  if (!req.cookies['auth']) {
    return res.redirect('/connexion')
  }
  next()
}

router.get('/ajouter', ensureAuthenticated, userController.ajouterVehicule)
router.post('/vehicule', ensureAuthenticated, userController.creerVehicule)
router.post('/supprimerVehicule', ensureAuthenticated, userController.supprimerVehicule)


router.get('/deconnexion', ensureAuthenticated, userController.deconnexion)

module.exports = router;