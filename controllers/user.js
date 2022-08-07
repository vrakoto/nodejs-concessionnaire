const pathBodyHTML = '../views/partials/body';
const bcrypt = require('bcrypt');

const { Sequelize } = require('sequelize');
const Utilisateur = require('../models/Utilisateur');
const sequelize = new Sequelize('conc', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = {
    ajouterVehicule: (req, res) => {
        return res.render(pathBodyHTML, {
            page: "./user/ajouterVehicule",
            titre: "Ajouter un véhicule",
            messageFormulaire: req.session.message
        });
    },

    supprimerVehicule: (req, res) => {
        const { idVehicule } = req.body

        VehiculeModel.findByIdAndDelete(idVehicule, (err, res) => {
            if (err) {
                return res.send({
                    type: 'erreur',
                    code: 505,
                    message: "Erreur interne lors de la suppression du véhicule",
                    raison: err
                })
            }

            return res.send({
                type: 'success',
                code: 200,
                message: "Vehicule supprimé !"
            })
        })
    },

    creerVehicule: (req, res) => {
        const { type, image, marque, modele, energie, boite, annee, km, description, prix } = req.body
        const vendeur = req.cookies['auth'].identifiant

        const currentYear = new Date().getFullYear()
        let erreurs = {}

        for (const [key, value] of Object.entries(req.body)) {
            if (value.trim() === '') {
                erreurs[key] = 'le champ est vide'
            }
        }

        if (type !== 'voiture' && type !== 'moto') {
            erreurs['type'] = "le type du véhicule est invalide"
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

        async function add() {
            await prisma.vehicule.create({
                data: {
                    vendeurId: vendeur,
                    type,
                    image,
                    marque,
                    modele,
                    energie,
                    boite,
                    annee: parseInt(annee),
                    km: parseInt(km),
                    description,
                    prix: parseFloat(prix)
                },
            });
        }

        add()
            .then(async () => {
                await prisma.$disconnect()
                return res.send({
                    type: 'success',
                    code: 200,
                    message: "Vehicule créé",
                    vehicule: 'ok'
                })
            })
            .catch(async (error) => {
                await prisma.$disconnect()
                return res.send({
                    type: 'erreur',
                    code: 505,
                    message: "Error while creating the vehicle",
                    raison: error
                })
            })
    },

    createUser: (req, res) => {
        const { nom, prenom, ville, mdp, mdp_c } = req.body
        let erreurs = {}

        for (const [key, value] of Object.entries(req.body)) {
            if (value.trim() === '') {
                erreurs[key] = 'le champ est vide'
            }
        }

        if (mdp !== mdp_c) {
            erreurs['mdp'] = "Les mots de passe ne correspondent pas"
        }

        if (Object.entries(erreurs).length > 0) {
            req.session.message = "Erreur formulaire"
            return res.redirect('back')
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(mdp, salt);

        sequelize.sync().then(() => {
            Utilisateur.create({
                nom,
                prenom,
                ville,
                mdp: hash
            });
        }).then(() => {
            req.session.message = "Inscription réussi, connectez-vous !"
            return res.redirect('/connexion')
        })
        .catch((error) => {
            return res.status(500).json({
                status: 500,
                message: "Internal Error while creating the user",
                err: error
            })
        })
    },

    deconnexion: (req, res) => {
        res.clearCookie('auth')
        return res.redirect('back')
    }
}