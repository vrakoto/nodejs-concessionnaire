const { Schema, model } = require('mongoose');

const current = new Date()
const timeStamp = new Date(Date.UTC(current.getFullYear(), 
current.getMonth(),current.getDate(),current.getHours(), 
current.getMinutes(), current.getSeconds(), current.getMilliseconds(), current.getUTCHours()));

const Vehicule = new Schema({
    vendeur: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    marque: String,
    modele: String,
    energie: String,
    boite: String,
    annee: Number,
    km: Number,
    description: String,
    prix: Number,
    date_publication: {
        type: Date,
        default: timeStamp
    }
})

const VehiculeModel = model('Vehicule', Vehicule);

module.exports = VehiculeModel;