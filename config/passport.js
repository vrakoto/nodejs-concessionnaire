const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Utilisateur = require('../models/Utilisateur');

module.exports = function (passport) {
    passport.use(new LocalStrategy({
            usernameField: 'identifiant',
            passwordField: 'mdp',
        },
        (identifiant, mdp, done) => {
            Utilisateur.findByPk(identifiant)
                .then(function (user) {
                    if (user && bcrypt.compareSync(mdp, user.mdp)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                })
                .catch(err => done(err));
        }
    ));

    passport.serializeUser(function (user, done) {
        process.nextTick(function () {
            done(null, { identifiant: user.identifiant, nom: user.nom, prenom: user.prenom });
        });
    });

    passport.deserializeUser(function (user, done) {
        process.nextTick(function () {
            return done(null, user);
        });
    });
}