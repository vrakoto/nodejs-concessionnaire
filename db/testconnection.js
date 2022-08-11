const {sequelize} = require('./config')
exports.connect = () => {
    sequelize.authenticate().then(() => {
        // console.log('Connection has been established successfully.');
    }).catch((error) => {
        console.log('Impossible de se connecter à la DB');
    })
}