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
                page: 'vehicule'
            })
        })
    },

    createVehicule: (req, res) => {
        const {marque, modele, annee, km} = req.body

        let erreurs = {}
        const currentYear = new Date().getFullYear()

        for (const [key, value] of Object.entries(req.body)) {
            if (value.trim() === '') {
                erreurs[key] = 'le champ est vide'
            }
        }

        if (annee < 1950 || annee > currentYear) {
            erreurs['annee'] = "L'année doit être comprit entre 1950 et " + currentYear
        }

        if (km < 0 || km > 1500000) {
            erreurs['km'] = "Le kilométrage total doit être comprit entre 0 et 1.500.000"
        }

        if (Object.entries(erreurs).length > 0) {
            req.session.message = erreurs
            return res.redirect('back')
        }

        const user = new VehiculeModel({marque, modele, annee, km})
        user.save((err) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Error while creating the vehicle",
                    err
                })
            }
        })
        return res.redirect('back')
    }
}