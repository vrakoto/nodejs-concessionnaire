const { Schema, model } = require('mongoose');

const current = new Date()
const timeStamp = new Date(Date.UTC(current.getFullYear(), 
current.getMonth(),current.getDate(),current.getHours(), 
current.getMinutes(), current.getSeconds(), current.getMilliseconds(), current.getUTCHours()));

const User = new Schema({
    nom: String,
    prenom: String,
    ville: String,
    mdp: String,
    date_creation: {
        type: Date,
        default: timeStamp
    }
})

const UserModel = model('User', User);

module.exports = UserModel;