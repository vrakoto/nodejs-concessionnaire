const UserModel = require("../models/User");
const VehiculeModel = require("../models/Vehicule");
const pathBodyHTML = '../views/partials/body';
const bcrypt = require('bcrypt');

module.exports = {
    home: (req, res) => {
        return res.render(pathBodyHTML, {
            page: "index",
            titre: " Accueil"
        });
    },

    parcourir: (req, res) => {
        let titre = "Parcourir";
        const type = (req.params.type) ? req.params.type : "all";
        let s = {};
        if (type !== 'all') {
            titre = "Rechercher par " + type;
            s = {type: type};
        }

        VehiculeModel.find(s, (err, lesVehicules) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Error while searching the vehicles",
                    err
                })
            }
            return res.render(pathBodyHTML, {
                page: "parcourir",
                titre: titre,
                type: type,
                lesVehicules
            });
        })
    },

    getVehicule: (req, res) => {
        const {id} = req.params;
        let nomprenom = '';
       
        VehiculeModel.findById(id, (err, vehicule) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Error while searching the vehicle",
                    err
                });
            }
            UserModel.findById(vehicule.vendeur, (errUser, user) => {
                if (errUser) {
                    return res.status(500).json({
                        status: 500,
                        message: "Internal Error while searching the seller's information",
                        err
                    });
                }
                nomprenom = `${user.nom} ${user.prenom}`;
            });
            return res.render('../views/partials/body', {
                titre: 'Fiche Véhicule',
                page: 'vehicule',
                nomprenom,
                vehicule
            })
        })
    },

    connexion: (req, res) => {
        return res.render(pathBodyHTML, {
            page: "connexion",
            titre: "Connexion",
            messageFormulaire: req.session.message
        });
    },

    seConnecter: (req, res) => {
        const {identifiant, mdp} = req.body

        UserModel.findById(identifiant, (err, user) => {
            if (err && err.name !== 'CastError') {
                return res.status(500).json({
                    err
                });
            }

            if (user && bcrypt.compareSync(mdp, user.mdp)) {
                res.cookie('auth', {
                    identifiant,
                    nom: user.nom,
                    prenom: user.prenom,
                    ville: user.ville
                })
                return res.redirect('/')
            } else {
                req.session.message = 'Authentification incorrect'
                return res.redirect('back')
            }
        })
    },

    inscription: (req, res) => {
        return res.render(pathBodyHTML, {
            page: "inscription",
            titre: "Inscription",
            messageFormulaire: req.session.message
        });
    },
}