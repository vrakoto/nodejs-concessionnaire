const pathBodyHTML = '../views/partials/body';
const Utilisateur = require('../models/Utilisateur');
const Vehicule = require('../models/Vehicule');
const isImageURL = require('image-url-validator').default;
let car_brands = require('../data/car_brands.json');
let motorcycle_brands = require('../data/motorcycle_brands.json');

module.exports = {
    ajouterVehicule: (req, res) => {
        return res.render(pathBodyHTML, {
            page: "./user/ajouterVehicule",
            titre: "Ajouter un véhicule"
        });
    },

    creerVehicule: (req, res) => {
        const { type, image, marque, modele, energie, boite, description } = req.body
        const annee = parseInt(req.body.annee)
        const prix = parseFloat(req.body.prix)
        const km = parseInt(req.body.km)
        const UtilisateurIdentifiant = req.user.identifiant // vendeur
        const fieldValues = {
            type,
            image,
            marque,
            modele,
            energie,
            boite,
            annee,
            prix,
            km,
            description,
            UtilisateurIdentifiant
        }
        const fieldsValid = {}

        let erreurs = []

        async function check() {
            let liste_marques = car_brands
            if (type !== 'voiture' && type !== 'moto') {
                erreurs.push({msg: "Le type du véhicule est invalide" })
            } else {
                fieldsValid['type'] = type
            }
            
            if (type === 'moto') {
                liste_marques = motorcycle_brands
            }

            const validImageURL = await isImageURL(image);
            if (!validImageURL) {
                erreurs.push({msg: "L'URL de l'image n'est pas correcte ou ne contient aucune image"})
            } else {
                fieldsValid['image'] = image 
            }
            
            if (marque.length < 2) {
                erreurs.push({msg: "La marque est trop courte"})
            } else {
                let validMarque = false
                liste_marques.forEach(element => {
                    if (marque.toLowerCase() === element.name.toLowerCase()) {
                        validMarque = true
                    }
                });
                if (!validMarque) {
                    erreurs.push({msg: `La marque "${marque}" est inexistante ou a été mal ortographié`})
                } else {
                    fieldsValid['marque'] = marque 
                }
            }

            if (modele.length < 2) {
                erreurs.push({msg: "Le nom du modèle est trop court"})
            } else {
                fieldsValid['modele'] = modele 
            }

            if (boite === 'automatique' || boite === 'manuelle' || boite === 'sequentielle') {
                fieldsValid['boite'] = boite 
            } else {
                erreurs.push({msg: "La boîte de transmission est inexistante"})
            }
    
            if (energie === 'essence' || energie === 'diesel' || energie === 'electrique' || energie === 'hybride') {
                fieldsValid['energie'] = energie 
            } else {
                erreurs.push({msg: "L'énergie est inexistant"})
            }
    
            const currentYear = new Date().getFullYear()
            if (annee > 1950 && annee <= currentYear) {
                fieldsValid['annee'] = annee 
            } else {
                erreurs.push({msg: `L'année doit être comprit entre 1950 et ${currentYear}`})
            }
    
            if (km > 0 && km < 5500000) {
                fieldsValid['km'] = km 
            } else {
                erreurs.push({msg: "Le kilométrage total doit être comprit entre 0 et 5.500.000"})
            }

            if (description.trim() !== '') {
                fieldsValid['description'] = description 
            }

            if (prix > 0 && prix < 30000000) {
                fieldsValid['prix'] = prix 
            } else {
                erreurs.push({msg: "Le prix de vente doit être comprit entre 0 et 30.000.000 €"})
            }
    
            return erreurs
        }


        async function add() {
            return await Vehicule.create(fieldValues);
        }

        check().then((metError) => {
            if (metError.length > 0) {
                req.flash(
                    'errors_form',
                    metError,
                )
                req.flash(
                    'keep_values',
                    fieldsValid
                )
                return res.redirect('/user/ajouter')
            }

            add().then((data) => {
                req.flash(
                    'success_msg',
                    'Véhicule ajouté en vente !'
                )
                return res.redirect('/user/ajouter')
            }).catch((error) => {
                req.flash(
                    'error_msg',
                    'Un problème interne a été rencontré lors de la tentative de création du véhicule'
                )
                return res.redirect('/user/ajouter')
            })
        })
    },

    supprimerVehicule: (req, res) => {
        const idVehicule = req.params.id
        let isOwner = false

        async function del() {
            const leVehicule = await Vehicule.findOne({
                where: {
                    id: idVehicule,
                    UtilisateurIdentifiant: res.locals.auth.identifiant
                }
            })

            if (leVehicule) {
                await Vehicule.destroy({
                    where: {
                        id: idVehicule
                    }
                })
                isOwner = true
            }
            return isOwner
        }

        del().then((isOwner) => {
            if (isOwner) {
                req.flash(
                    'success_msg',
                    'Vehicule supprimé !'
                )
            } else {
                req.flash(
                    'error_msg',
                    "Vous n'êtes pas le propriétaire du véhicule !"
                )
            }
            return res.redirect('back')
        }).catch((error) => {
            req.flash(
                'error_msg',
                "Erreur interne lors de la suppression du véhicule"
            )
            return res.redirect('back')
        })
    },

    deconnexion: (req, res) => {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/')
        });
    },
}