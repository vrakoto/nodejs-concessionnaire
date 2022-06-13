const UserModel = require('../models/User')
const VehiculeModel = require('../models/Vehicule')
const pathBodyHTML = '../views/partials/body';
const bcrypt = require('bcrypt');

module.exports = {
    ajouterVehicule: (req, res) => {
        return res.render(pathBodyHTML, {
            page: "./user/ajouterVehicule",
            titre: "Concessionnaire - Ajouter un véhicule",
            messageFormulaire: req.session.message
        });
    },

    creerVehicule: (req, res) => {
        const {marque, modele, energie, boite, annee, km, description, prix} = req.body
        const vendeur = req.cookies['auth'].identifiant
        const vehicule = new VehiculeModel({vendeur, marque, modele, energie, boite, annee, km, description, prix})
        
        const currentYear = new Date().getFullYear()
        let erreurs = {}

        for (const [key, value] of Object.entries(req.body)) {
            if (value.trim() === '') {
                erreurs[key] = 'le champ est vide'
            }
        }

        if (energie !== 'essence' && energie !== 'diesel' && energie !== 'electrique' && energie !== 'hybride') {
            erreurs['energie'] = "l'énergie est inexistant"
        }

        if (boite !== 'automatique' && boite !== 'manuelle' && boite !== 'sequentielle') {
            erreurs['boite'] = "la boîte de transmission est inexistante"
        }

        if (annee < 1950 || annee > currentYear) {
            erreurs['annee'] = "l'année doit être comprit entre 1950 et " + currentYear
        }

        if (km < 0 || km > 1500000) {
            erreurs['km'] = "Le kilométrage total doit être comprit entre 0 et 1.500.000"
        }

        if (prix < 0 || prix > 30000000) {
            erreurs['prix'] = "Le prix de vente doit être comprit entre 0 et 30.000.000"
        }

        if (Object.entries(erreurs).length > 0) {
            req.session.message = erreurs
            return res.send({
                type: 'erreur',
                code: 404,
                message: "Formulaire invalide",
                raison: erreurs
            })
        }

        vehicule.save((err, vehicule) => {
            if (err) {
                return res.send({
                    type: 'erreur',
                    code: 505,
                    message: "Erreur interne",
                    raison: err
                })
            } else {
                return res.send({
                    type: 'success',
                    code: 200,
                    message: "Vehicule créé",
                    vehicule
                })
            }
        })
    },

    createUser: async (req, res) => {
        const {nom, prenom, ville} = req.body
        let mdp = req.body.mdp
        let erreurs = {}
    
        for (const [key, value] of Object.entries(req.body)) {
            if (value.trim() === '') {
                erreurs[key] = 'le champ est vide'
            }
        }

        if (Object.entries(erreurs).length > 0) {
            req.session.message = "Erreur formulaire"
            return res.redirect('back')
        }

        bcrypt.hash(mdp, 10).then(function(hash) {
            mdp = hash
            const user = new UserModel({nom, prenom, ville, mdp})
            user.save((err) => {
                if (err) {
                    return res.status(500).json({
                        status: 500,
                        message: "Internal Error while creating the user",
                        err
                    })
                }
            })
        })

        req.session.message = "Inscription réussi, connectez-vous !"
        return res.redirect('/connexion')
    },

    deconnexion: (req, res) => {
        res.clearCookie('auth')
        return res.redirect('back')
    }
}