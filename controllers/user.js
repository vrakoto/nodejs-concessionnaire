const pathBodyHTML = '../views/partials/body';
const bcrypt = require('bcrypt');
const Utilisateur = require('../models/Utilisateur');
const Vehicule = require('../models/Vehicule');
const isImageURL = require('image-url-validator').default;
let car_brands = require('../data/car_brands.json');
let motorcycle_brands = require('../data/motorcycle_brands.json');

var messageFormulaire = (typeof messageFormulaire !== 'undefined') ? messageFormulaire : ''
module.exports = {
    ajouterVehicule: (req, res) => {
        return res.render(pathBodyHTML, {
            page: "./user/ajouterVehicule",
            titre: "Ajouter un véhicule",
            messageFormulaire
        });
    },

    creerVehicule: (req, res) => {
        const { type, image, marque, modele, energie, boite, annee, km, description, prix } = req.body
        const UtilisateurIdentifiant = req.cookies['auth'].identifiant // vendeur

        let erreurs = {}

        async function check() {
            let liste_marques = car_brands
            if (type !== 'voiture' && type !== 'moto') {
                erreurs['type'] = "Le type du véhicule est invalide" 
            }
            if (type === 'moto') {
                liste_marques = motorcycle_brands
            }

            const validImageURL = await isImageURL(image);
            if (!validImageURL) {
                erreurs['image'] = "L'URL de l'image n'est pas correcte ou ne contient aucune image"
            }
            
            if (marque.length < 2) {
                erreurs['marque'] = "La marque est trop courte"
            } else {
                let validMarque = false
                liste_marques.forEach(element => {
                    if (marque.toLowerCase() === element.name.toLowerCase()) {
                        validMarque = true
                    }
                });
                if (!validMarque) {
                    erreurs['marque'] = `La marque "${marque}" est inexistante ou a été mal ortographié`
                }
            }

            if (modele.length < 2) {
                erreurs['modele'] = "Le nom du modèle est trop court"
            }
    
            if (boite !== 'automatique' && boite !== 'manuelle' && boite !== 'sequentielle') {
                erreurs['boite'] = "La boîte de transmission est inexistante"
            }
    
            if (energie !== 'essence' && energie !== 'diesel' && energie !== 'electrique' && energie !== 'hybride') {
                erreurs['energie'] = "L'énergie est inexistant"
            }
    
            const currentYear = new Date().getFullYear()
            if (annee < 1950 || annee > currentYear) {
                erreurs['annee'] = "L'année doit être comprit entre 1950 et " + currentYear
            }
    
            if (km < 0 || km > 1500000) {
                erreurs['km'] = "Le kilométrage total doit être comprit entre 0 et 1.500.000"
            }
    
            if (prix < 0 || prix > 30000000) {
                erreurs['prix'] = "Le prix de vente doit être comprit entre 0 et 30.000.000"
            }
    
            if (Object.entries(erreurs).length > 0) {
                messageFormulaire = {
                    general: "Formulaire invalide",
                    erreurs
                }
                return erreurs
            }
        }


        async function add() {
            return await Vehicule.create({
                type,
                image,
                marque,
                modele,
                energie,
                boite,
                annee: parseInt(annee),
                km: parseInt(km),
                description,
                prix: parseFloat(prix),
                UtilisateurIdentifiant
            });
        }

        check().then((metError) => {
            if (metError) {
                return module.exports.ajouterVehicule(req, res)
            }

            add().then((data) => {
                // return res.send({
                //     type: 'success',
                //     code: 200,
                //     message: "Vehicule créé",
                //     vehicule: data
                // })
                return module.exports.ajouterVehicule(req, res)
            }).catch((error) => {
                return res.send({
                    type: 'erreur',
                    code: 505,
                    message: "Error while creating the vehicle",
                    raison: error
                })
            })
        })
    },

    supprimerVehicule: (req, res) => {
        // const idVehicule = req.params.id
        const { idVehicule } = req.body
        let isOwner = false

        async function del() {
            const utilisateur = await Vehicule.findOne({
                where: {
                    UtilisateurId: req.cookies['auth'].identifiant
                }
            })

            if (utilisateur) {
                await Vehicule.destroy({
                    where: {
                        id: idVehicule
                    }
                });
                isOwner = true
            }

            return isOwner
        }

        del().then((isOwner) => {
            if (isOwner) {
                return res.redirect('back')
            } else {
                return res.send({
                    type: 'erreur',
                    code: 505,
                    message: "Vous n'êtes pas le propriétaire du véhicule !"
                })
            }
        }).catch((error) => {
            return res.send({
                type: 'erreur',
                code: 505,
                message: "Erreur interne lors de la suppression du véhicule",
                raison: error
            })
        })
    },

    deconnexion: (req, res) => {
        res.clearCookie('auth')
        return res.redirect('back')
    }
}