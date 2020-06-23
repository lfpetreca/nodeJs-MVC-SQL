const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const sequelize = require('./utils/database')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

//Sync with DB then listen the app
sequelize.sync()
    .then(result => {
        app.listen(3000)
    })
    .catch(err => console.error(err))
