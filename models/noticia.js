const moongose = require('mongoose')

const NoticiaSchema = new moongose.Schema({
    title: String,
    content: String, 
    category: String
})

const Noticia = moongose.model('Noticia', NoticiaSchema)

module.exports = Noticia