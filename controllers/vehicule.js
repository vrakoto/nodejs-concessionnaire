const VehiculeModel = require('../models/Vehicule')
const pathBodyHTML = '../views/partials/body';

module.exports = {
    getVehicule: (req, res) => {
        const {id} = req.params
        VehiculeModel.findById(id, (err, vehicule) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Error while searching the vehicle",
                    err
                })
            }

            return res.render('../views/partials/body', {
                titre: 'Concessionnaire - Fiche Véhicule',
                page: 'vehicule',
                vehicule
            })
        })
    },

    createVehicule: (req, res) => {
        let erreurs = {}
        const currentYear = new Date().getFullYear()
        const vendeur = res.session.login
        const {marque, modele, energie, boite, annee, km, description, prix} = req.body
        const vehicule = new VehiculeModel({vendeur, marque, modele, energie, boite, annee, km, description, prix})

        for (const [key, value] of Object.entries(req.body)) {
            if (value.trim() === '') {
                erreurs[key] = 'le champ est vide'
            }
        }

        /* if (annee < 1950 || annee > currentYear) {
            erreurs['annee'] = "L'année doit être comprit entre 1950 et " + currentYear
        } */

        if (km < 0 || km > 1500000) {
            erreurs['km'] = "Le kilométrage total doit être comprit entre 0 et 1.500.000"
        }

        if (prix < 0 || prix > 30000000) {
            erreurs['prix'] = "Le prix de vente doit être comprit entre 0 et 30.000.000"
        }

        if (Object.entries(erreurs).length > 0) {
            req.session.message = erreurs
            return res.redirect('back')
        }

        vehicule.save((err, vehicule) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Error while selling the vehicle",
                    err
                })
            }
        })
        // return res.redirect('back')
    }
}