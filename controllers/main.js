const pathBodyHTML = '../views/partials/body';
const bcrypt = require('bcrypt');
const Utilisateur = require('../models/Utilisateur');
const Vehicule = require('../models/Vehicule');

var messageFormulaire = (typeof messageFormulaire !== 'undefined') ? messageFormulaire : ''
module.exports = {
    home: (req, res) => {
        return res.render(pathBodyHTML, {
            page: "index",
            titre: " Accueil"
        });
    },

    connexion: (req, res) => {
        return res.render(pathBodyHTML, {
            page: "connexion",
            titre: "Connexion",
            messageFormulaire
        });
    },

    seConnecter: (req, res) => {
        const { identifiant, mdp } = req.body

        async function validAuth() {
            const utilisateur = await Utilisateur.findOne({
                where: {
                    identifiant
                }
            });

            return (utilisateur) ? await bcrypt.compare(mdp, utilisateur.mdp) : false
        }


        validAuth().then((bool) => {
            if (bool) {
                res.cookie('auth', {
                    identifiant
                })
                return res.redirect('/')
            } else {
                messageFormulaire = {
                    type: 'error',
                    message: 'Authentification incorrect'
                }
                return module.exports.connexion(req, res)
            }
        }).catch((error) => {
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: "Internal Error while attempting to connect",
                err: error
            });
        })
    },

    parcourir: async (req, res) => {
        let titre = "Parcourir";
        const type = (req.params.type) ? req.params.type : "all";
        let s = {};
        if (type !== 'all') {
            titre = "Rechercher par " + type;
            s = { where: { type: type } };
        }

        async function getLesVehicules() {
            const lesVehicules = await Vehicule.findAll(s)
            return lesVehicules
        }

        getLesVehicules().then((data) => {
            return res.render(pathBodyHTML, {
                page: "parcourir",
                titre: titre,
                type: type,
                lesVehicules: data
            });
        }).catch((error) => {
            return res.status(500).json({
                status: 500,
                message: "Internal Error while searching the vehicles",
                err: error
            });
        })
    },

    getVehicule: (req, res) => {
        const { id } = req.params;

        async function get() {
            const vehicule = await Vehicule.findByPk(parseInt(id), {
                include: {
                    model: Utilisateur,
                    attributes: ['identifiant', 'nom', 'prenom']
                }
            })
            return vehicule
        }

        get()
            .then((vehicule) => {
                console.log(vehicule);
                return res.render('../views/partials/body', {
                    titre: 'Fiche Véhicule',
                    page: 'vehicule',
                    vehicule
                })
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).json({
                    status: 500,
                    message: "Internal Error while fetching the vehicle",
                    err: error
                });
            })
    },

    inscription: (req, res) => {
        return res.render(pathBodyHTML, {
            page: "inscription",
            titre: "Inscription",
            messageFormulaire
        });
    },

    createUser: (req, res) => {
        const { identifiant, nom, prenom, ville, mdp, mdp_c } = req.body
        let erreurs = {}

        async function checkForms() {
            const identifiantExists = await Utilisateur.findByPk(identifiant).then((data) => (data) ? true : false)

            if (identifiant.length < 3) {
                erreurs["identifiant"] = "L'identifiant est trop court"
            } else if (identifiantExists) {
                erreurs["identifiant"] = "Cet identifiant a déjà été prit"
            }

            if (nom.length < 2) {
                erreurs["nom"] = 'Le nom est trop court'
            }

            if (prenom.length < 2) {
                erreurs["prenom"] = 'Le prénom est trop court'
            }

            if (ville.length < 2) {
                erreurs["ville"] = 'La ville est trop courte'
            }

            if (mdp.length < 3) {
                erreurs["ville"] = 'Le mot de passe est trop court'
            } else if (mdp !== mdp_c) {
                erreurs['mdp'] = "Les mots de passe ne correspondent pas"
            }

            if (Object.entries(erreurs).length > 0) {
                messageFormulaire = {
                    general: "Formulaire invalide",
                    erreurs
                }
                return erreurs
            }
        }

        const hash = bcrypt.hashSync(mdp, bcrypt.genSaltSync(10));
        async function create() {
            await Utilisateur.create({
                identifiant,
                nom,
                prenom,
                ville,
                mdp: hash
            })
        }

        checkForms().then((metError) => {
            if (metError) {
                return module.exports.inscription(req, res)
            }

            create().then(() => {
                return module.exports.connexion(req, res)
            }).catch((error) => {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Error while creating the user",
                    err: error
                })
            })
        })
    },
}