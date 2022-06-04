const express = require('express')
const router = express.Router()

const Noticias = require('../models/noticia')

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.roles.indexOf('admin') >= 0) {
            //pode passar se for admin e ir para /noticias/admin
            return next()
        } else {
          return res.redirect('/')
        }
    }
    res.redirect('/login')
})

router.get('/', (req, res) => {
    res.send('admin')
})

router.get('/noticias', async (req, res) => {
    const noticias = await Noticias.find({})
    res.render('noticias/admin', { noticias })
})


module.exports = router 