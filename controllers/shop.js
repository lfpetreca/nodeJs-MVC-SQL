const Product = require('../models/product')
const Order = require('../models/order')

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            })
        })
        .catch(err => console.err(err))
}

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            })
        })
        .catch(err => console.err(err))
}

exports.getProduct = (req, res, next) => {
    Product.findByPk(req.params.productId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => console.error(err))
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        pageTitle: 'Your Cart',
                        path: '/cart',
                        products: products
                    })
                })
                .catch(err => console.error(err))
        })
        .catch(err => console.error(err))
}

exports.postCart = (req, res, next) => {
    let fetchedCart
    let newQuantity = 1

    req.user.getCart()
        .then(cart => {
            fetchedCart = cart
            return cart.getProducts({ where: { id: req.body.productId } })
        })
        .then(products => {
            let product
            if (products.length > 0) {
                product = products[0]
            }

            if (product) {
                const previousQuantity = product.CartItem.quantity;
                newQuantity = previousQuantity + 1;
                return product;
            }

            return Product.findByPk(req.body.productId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: { quantity: newQuantity }
            })
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => console.error(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: req.body.productId } })
        })
        .then(products => {
            const product = products[0]
            return product.CartItem.destroy()
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => console.error(err))
}

exports.postOrder = (req, res, next) => {
    let fetchedCart

    req.user.getCart()
        .then(cart => {
            fetchedCart = cart
            return cart.getProducts()
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    order.addProduct(products.map(
                        product => {
                            product.OrderItem = { quantity: product.CartItem.quantity }
                            return product
                        })
                    )
                })
                .catch(err => console.error(err))
        })
        .then(() => {
            return fetchedCart.setProducts(null)
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(err => console.error(err))
}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({ include: ['Products'] })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Your orders',
                path: '/orders',
                orders: orders
            })
        })
        .catch(err => console.error(err))
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    })
}