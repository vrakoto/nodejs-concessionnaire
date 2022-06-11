const UserModel = require('../models/User')
const pathBodyHTML = '../views/partials/body';
const bcrypt = require('bcrypt');

module.exports = {
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

    deconnexion: (req, res) => {
        res.clearCookie('auth')
        return res.redirect('back')
    }
}