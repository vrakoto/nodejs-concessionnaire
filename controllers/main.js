const VehiculeModel = require("../models/Vehicule");
const pathBodyHTML = '../views/partials/body';

module.exports = {
    home: (req, res) => {
        return res.render(pathBodyHTML, {
            page: "index",
            titre: "Concessionnaire - Accueil"
        });
    },

    parcourir: (req, res) => {
        VehiculeModel.find({}, (err, lesVehicules) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Error while searching the vehicles",
                    err
                })
            }
            return res.render(pathBodyHTML, {
                page: "parcourir",
                titre: "Concessionnaire - Parcourir",
                lesVehicules
            });
        })
    },

    connexion: (req, res) => {
        return res.render(pathBodyHTML, {
            page: "connexion",
            titre: "Concessionnaire - Connexion",
            messageFormulaire: req.session.message
        });
    },

    inscription: (req, res) => {
        return res.render(pathBodyHTML, {
            page: "inscription",
            titre: "Concessionnaire - Inscription",
            messageFormulaire: req.session.message
        });
    },

    ajoutVehicule: (req, res) => {
        return res.render(pathBodyHTML, {
            page: "./user/ajouterVehicule",
            titre: "Concessionnaire - Ajouter un véhicule",
            messageFormulaire: req.session.message
        });
    },
}