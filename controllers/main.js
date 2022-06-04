/* const ArticleModel = require('../models/Article')
const UserModel = require('../models/User') */

const pathBodyHTML = '../views/partials/body';

module.exports = {
    getHome: (req, res) => {
        return res.render(pathBodyHTML, {page: "index", titre: "Accueil"});
    },

    parcourir: (req, res) => {
        return res.render(pathBodyHTML, {page: "parcourir", titre: "Parcourir"});
    }
}