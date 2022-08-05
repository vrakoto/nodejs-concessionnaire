const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
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
            s = { where: { type: type } };
        }

        async function getVehicules() {
            const lesVehicules = await prisma.vehicule.findMany(s);
            return lesVehicules;
        }

        getVehicules()
            .then(async (lesVehicules) => {
                await prisma.$disconnect()
                return res.render(pathBodyHTML, {
                    page: "parcourir",
                    titre: titre,
                    type: type,
                    lesVehicules
                });
            })
            .catch(async (error) => {
                await prisma.$disconnect()
                return res.status(500).json({
                    status: 500,
                    message: "Internal Error while searching the vehicles",
                    err: error
                });
            })
    },

    getVehicule: (req, res) => {
        const { id } = req.params;
        let nomprenom = '';

        async function get() {
            const vehicule = await prisma.vehicule.findUniqueOrThrow({
                where: {
                    id: parseInt(id)
                },
                include: {
                    vendeur: {
                        select: {
                            nom: true,
                            prenom: true
                        },
                    },
                },
            })
            return vehicule
        }

        get()
            .then(async (vehicule) => {
                return res.render('../views/partials/body', {
                    titre: 'Fiche Véhicule',
                    page: 'vehicule',
                    vehicule
                })
            })
            .catch(async (error) => {
                console.log(error);
                return res.status(500).json({
                    status: 500,
                    message: "Internal Error while searching the vehicle",
                    err: error
                });
            })
    },

    connexion: (req, res) => {
        return res.render(pathBodyHTML, {
            page: "connexion",
            titre: "Connexion",
            messageFormulaire: req.session.message
        });
    },

    seConnecter: async (req, res) => {
        const { identifiant, mdp } = req.body
        const identifiantParsed = parseInt(identifiant)

        async function connect() {
            const user = await prisma.utilisateur.findUnique({
                where: {
                    id: identifiantParsed
                }
            });

            if (user && bcrypt.compareSync(mdp, user.mdp)) {
                res.cookie('auth', {
                    identifiant: user.id,
                    nom: user.nom,
                    prenom: user.prenom,
                    ville: user.ville
                })
                return res.redirect('/')
            } else {
                req.session.message = 'Authentification incorrect'
                return res.redirect('back')
            }
        }

        connect()
            .then(async () => {
                await prisma.$disconnect()
            })
            .catch(async (error) => {
                await prisma.$disconnect()
                return res.status(500).json({
                    status: 500,
                    message: "Internal Error while attempting to connect",
                    err: error
                });
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