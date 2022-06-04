const express = require('express')
const app = express()
const path = require('path')
const os = require('os')
const hostname = os.hostname
const session = require('express-session')
const port = process.env.PORT || 3000 
const host = process.env.HOST || hostname

const dbfunctions = require('./utils/dbfunctions')

//routes 
const auth = require('./routes/auth')
const noticias = require('./routes/noticias')
const restrito = require('./routes/restrito')
const pages = require('./routes/pages')
const admin = require('./routes/admin')

//models
const User = require('./models/user')
const Noticia = require('./models/noticia')

//string de comunicação com o mongodb
const mongoose = require('mongoose')
const mongoString = process.env.MONGO_DB || `mongodb://${hostname}:27017/noticias`

//tratando dados de entrada 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//engine de renderização front
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//middlewares de sessão
app.use(session({
    secret:'vegeta',
    resave: true,
    saveUninitialized: true,
}))

//arquivos estáticos
app.use(express.static('public'))

app.use('/', auth)
app.use('/', pages)
app.use('/restrito', restrito)
app.use('/noticias', noticias)
app.use('/admin', admin)



//executa o banco prameiro depois a nossa app 
mongoose
.connect(mongoString,  { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    dbfunctions.createInitialUser()
    app.listen(port, host, () => console.log(`Server running in host ${host} listening on port ${port}`))
})
.catch( e => console.log(e))

// const noticia1 = new Noticia({
//     title: 'Noticia publica '+ new Date().getTime(),
//     content: 'conteudo da noticia',
//     category: 'public'
// })

// const noticia2 = new Noticia({
//     title: 'Noticia publica '+ new Date().getTime(),
//     content: 'conteudo da noticia',
//     category: 'restrict'
// })

// noticia1.save()
// noticia2.save()

// dbfunctions.show()


