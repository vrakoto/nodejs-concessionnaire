const UserModel = require('../models/User')
const pathBodyHTML = '../views/partials/body';

module.exports = {
    createUser: (req, res) => {
        const {nom, prenom, ville, mdp} = req.body
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
        
        req.session.message = "Inscription réussi, connectez-vous !"
        return res.redirect('/connexion')
    },

    seConnecter: (req, res) => {
        const {identifiant} = req.body
        UserModel.findById(identifiant, (err, user) => {
            if (err && err.name !== 'CastError') {
                return res.status(500).json({
                    err
                });
            }

            if (user) {
                req.session.login = identifiant
                return res.redirect('/')
            } else {
                req.session.message = 'Authentification incorrect'
                return res.redirect('back')
            }
        })
    }
}