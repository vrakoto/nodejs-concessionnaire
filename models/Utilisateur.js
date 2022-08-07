const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('conc', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

class Utilisateur extends Model {}
Utilisateur.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    prenom: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    ville: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    mdp: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    date_creation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
},
    {
        timestamps: false,
        sequelize,
        modelName: 'Utilisateur',
        freezeTableName: true
    }
)

module.exports = Utilisateur;