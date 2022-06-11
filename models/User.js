const { Schema, model } = require('mongoose');

User = new Schema({
    nom: String,
    prenom: String,
    ville: String,
    mdp: String,
    date_create: Date
})

const UserModel = model('User', User);

module.exports = UserModel;