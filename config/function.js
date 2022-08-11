module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.redirect('/connexion')
        }
        next()
    },

    forwardAccessWhileConnected: (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect('back')
        }
        next()
    }
}