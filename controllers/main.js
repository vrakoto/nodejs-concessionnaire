const pathBodyHTML = '../views/partials/body';
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Utilisateur = require('../models/Utilisateur');
const Vehicule = require('../models/Vehicule');
const sequelize = require('sequelize');
const firstUpperCase = require('../public/javascripts/helper').firstUpperCase;

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
            titre: "Connexion"
        });
    },

    seConnecter: (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/connexion',
            failureFlash: { type: "error_msg", message: "Authentification incorrect" }
        })(req, res, next);
    },

    getLesVehicules: async (filtre = {}) => {
        const lesVehicules = await Vehicule.findAll(filtre)
        return lesVehicules
    },

    parcourir: async (req, res) => {
        let titre = "Parcourir";
        const type = (req.params.type) ? req.params.type : "all";
        const { recherche } = req.body

        let s = {};
        let f = {}

        if (recherche) {
            f = {
                [Op.or]: [
                    {
                        marque: {
                            [Op.like]: '%' + recherche + '%'
                        },
                    },
                    {
                        modele: {
                            [Op.like]: '%' + recherche + '%'
                        }
                    }
                ]
            }
        }
        if (type !== 'all') {
            titre = "Rechercher par " + type;
            f.type = type
        }

        s = {
            where: f
        }

        const lesVehicules = module.exports.getLesVehicules(s)
        lesVehicules.then((datas) => {
            return res.render(pathBodyHTML, {
                page: "parcourir",
                titre: titre,
                type: type,
                lesVehicules: datas
            });
        }).catch((error) => {
            req.flash(
                'error_msg',
                "Un problème interne a été rencontré lors de la tentative de récupération des véhicules"
            )
            return res.redirect('/parcourir')
        })
    },

    getVehicule: (req, res) => {
        const { id } = req.params;

        async function get() {
            const vehicule = await Vehicule.findByPk(parseInt(id), {
                attributes: [
                    'id', 'type', 'image', 'marque', 'modele', 'energie', 'boite', 'annee', 'km', 'description', 'prix',
                    [sequelize.fn('date_format', sequelize.col('publication'), '%d/%m/%Y'), 'publication']
                ],
                include: {
                    model: Utilisateur,
                    attributes: ['identifiant', 'nom', 'prenom']
                }
            })
            return vehicule
        }

        get()
            .then((vehicule) => {
                const vehiculeSimilaires = {
                    where: {
                        [Op.and]: [
                            {
                                marque: {
                                    [Op.like]: '%' + vehicule.marque + '%'
                                },
                            },
                            {
                                modele: {
                                    [Op.like]: '%' + vehicule.modele + '%'
                                }
                            }
                        ],
                        [Op.not]: [
                            {
                                id: vehicule.id
                            }
                        ]
                    }
                }
                const getLesVehicules = module.exports.getLesVehicules(vehiculeSimilaires)
                getLesVehicules.then((lesVehicules) => {
                    return res.render('../views/partials/body', {
                        titre: 'Fiche Véhicule',
                        page: 'vehicule',
                        vehicule,
                        css: 'vehicule',
                        lesVehicules,
                        firstUpperCase
                    })
                }).catch((error) => {
                    req.flash(
                        'error_msg',
                        "Un problème interne a été rencontré lors de la tentative de récupération des véhicules"
                    )
                    return res.redirect('/parcourir')
                })
            })
            .catch(() => {
                return res.render('../views/partials/body', {
                    titre: 'Véhicule Introuvable',
                    page: 'errors/notFound',
                    message: 'Ce véhicule est inexistant ou a été supprimé.'
                }) 
            })
    },


    getUtilisateur: async (req, res) => {
        const { id } = req.params;

        await Utilisateur.findByPk(id, {
            attributes: [
                'nom', 'prenom', 'ville',
                [sequelize.fn('date_format', sequelize.col('date_creation'), '%d/%m/%Y'), 'date_creation'],
            ],
            include: {
                model: Vehicule,
            },
            order: [
                [ Vehicule, 'id', 'DESC']
            ]
        }).then((datas) => {
            return res.render('../views/partials/body', {
                titre: `Profil de ${id}`,
                page: 'utilisateur',
                utilisateur: {
                    nom: datas.nom,
                    prenom: datas.prenom,
                    ville: datas.ville,
                    date_creation: datas.date_creation,
                },
                lesVehicules: datas.Vehicules,
                css: 'utilisateur',
                firstUpperCase
            })
        }).catch(() => {
            return res.render('../views/partials/body', {
                titre: 'Utilisateur introuvable',
                page: 'errors/notFound',
                message: "Cet utilisateur est inexistant ou a été supprimé."
            })
        })
    },

    inscription: (req, res) => {
        return res.render(pathBodyHTML, {
            page: "inscription",
            titre: "Inscription"
        });
    },

    createUser: (req, res) => {
        const { identifiant, nom, prenom, ville, mdp, mdp_c } = req.body
        const fieldsValid = {} // on conserve les champs ayant une valeur correcte
        let erreurs = []

        async function checkForms() {
            const identifiantExists = await Utilisateur.findByPk(identifiant).then((data) => (data) ? true : false)

            if (identifiant.length < 3) {
                erreurs.push({ msg: "L'identifiant est trop court" })
            } else if (identifiantExists) {
                erreurs.push({ msg: `L'identifiant "${identifiant}" a déjà été prit` })
            } else {
                fieldsValid['identifiant'] = identifiant
            }

            if (nom.length < 2) {
                erreurs.push({ msg: "Le nom est trop court" })
            } else {
                fieldsValid['nom'] = nom
            }

            if (prenom.length < 2) {
                erreurs.push({ msg: "Le prénom est trop court" })
            } else {
                fieldsValid['prenom'] = prenom
            }

            if (ville.length < 2) {
                erreurs.push({ msg: "La ville est trop courte" })
            } else {
                fieldsValid['ville'] = ville
            }

            if (mdp.length < 3) {
                erreurs.push({ msg: "Le mot de passe est trop court" })
            } else if (mdp !== mdp_c) {
                erreurs.push({ msg: "Les mots de passe ne correspondent pas" })
            } // on ne conserve pas le mdp

            return erreurs
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
            if (metError.length > 0) {
                req.flash(
                    'errors_form',
                    metError
                );

                req.flash(
                    'keep_values',
                    fieldsValid
                );
                return res.redirect('/inscription')
            }

            create().then(() => {
                req.flash(
                    'success_msg',
                    'Inscription réussie, connectez-vous !'
                );
                return res.redirect('/connexion')
            }).catch((error) => {
                req.flash(
                    'error_msg',
                    "Un problème interne a été rencontré lors de votre inscription, aucun compte n'a été créé pour l'instant"
                );
                return res.redirect('/connexion')
            })
        })
    },
}