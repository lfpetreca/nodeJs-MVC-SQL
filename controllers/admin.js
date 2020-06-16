const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productsCSS: true,
        activeAddProduct: true
    })
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(
        req.body.title,
        req.body.imageUrl,
        req.body.description,
        req.body.price
    )
    product.save()
    res.redirect('/')
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll(product => {
        res.render('admin/products', {
            prods: product,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        })
    })
}