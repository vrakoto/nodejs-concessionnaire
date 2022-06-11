const { Schema, model } = require('mongoose');

Vehicule = new Schema({
    marque: String,
    modele: String,
    annee: Number,
    km: Number
})

const VehiculeModel = model('Vehicule', Vehicule);

module.exports = VehiculeModel;