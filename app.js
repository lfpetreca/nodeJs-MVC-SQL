const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
//Models
const sequelize = require('./utils/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

//Middleware to find the user - for now a dummy one
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => console.err(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

//Schema Associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)

User.hasOne(Cart)
Cart.belongsTo(User)

Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })


//Sync with DB then listen the app
sequelize.sync(
    //{ force: true }//only on development
)
    .then(result => {
        return User.findByPk(1)
    })
    .then(user => {
        if (!user) {
            //create a dummy user
            return User.create({ name: 'Luis', email: 'email@email.com' })
        }
        return user // or explicit => return Promise.resolve(user)
    })
    .then(user => {
        return user.createCart()
    })
    .then(
        app.listen(3000)
    )
    .catch(err => console.error(err))
