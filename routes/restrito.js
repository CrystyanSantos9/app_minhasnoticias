const express = require('express')
const router = express.Router()

const Noticias = require('../models/noticia')

router.use( (req, res, next)=>{
    if(req.isAuthenticated()){
        if (req.user.roles.indexOf('restrito') >= 0) {
            //pode passar se for admin e ir para /noticias/admin
            return next()
        } else {
            return res.redirect('/')
        }
    }
    res.redirect('/login')
})

router.get('/', (req, res) => {
    res.send('restrito')
})

router.get('/noticias', async (req, res) => {
    const noticias = await Noticias.find({ category: 'restrict' })
    res.render('restrito/index', { noticias })
})


module.exports = router 