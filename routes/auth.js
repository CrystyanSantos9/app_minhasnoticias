require('dotenv').config()
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

// console.log(Object.getOwnPropertyNames(passport))


router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username })
    if (user) {
        const isValid = await user.checkPassword(password)
        if (isValid) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    } else {
        return done(null, false)
    }
}))

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: 'https://grafana.localhost.com/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
    const userLocalDB = await User.findOne({ facebookId: profile.id })
    if (!userLocalDB) {
        const userFacebook = new User({
            name: profile.displayName,
            facebookId: profile.id,
            roles: ['restrito']
        })
        await userFacebook.save()
        done(null, userFacebook)
    } else {
        done(null, userLocalDB)
    }
}))

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user
        if (!req.session.role) {
            req.session.role = req.user.roles[0]
        }
        res.locals.role = req.session.role
    }
    next()
})

router.get('/change-role/:role', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.roles.indexOf(req.params.role) >= 0) {
            req.session.role = req.params.role
        }
    }
    res.redirect('/')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})



router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
}))

router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/')
    }
)


module.exports = router 