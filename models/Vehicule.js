const { DataTypes, Model } = require('sequelize');
const {sequelize} = require('../db/config');
const Utilisateur = require('./Utilisateur')

class Vehicule extends Model {}
Vehicule.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    /* vendeur: {
        type: DataTypes.INTEGER,
        references: {
            model: Utilisateur,
            key: 'id',
        },
        allowNull: false
    }, */
    type: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    marque: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    modele: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    energie: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    boite: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    annee: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    km: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    prix: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    publication: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
},
    {
        timestamps: false,
        sequelize,
        modelName: 'Vehicule',
        freezeTableName: true
    }
)

module.exports = Vehicule;