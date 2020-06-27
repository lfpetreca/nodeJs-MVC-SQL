const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    req.user.createProduct({
        title: req.body.title,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        description: req.body.description
    })
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.error(err))
}

exports.getEditProduct = (req, res, next) => {
    if (!req.query.edit) {
        return res.redirect('/')
    }
    req.user.getProducts({ where: { id: req.params.productId } })
        .then(products => {
            const product = products[0]
            if (!product) {
                return res.redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: req.query.edit,
                product: product
            })
        })
        .catch(err => console.error(err))
}

exports.postEditProduct = (req, res, next) => {
    Product.findByPk(req.body.productId)
        .then(product => {
            product.title = req.body.title
            product.price = req.body.price
            product.imageUrl = req.body.imageUrl
            product.description = req.body.description

            return product.save()
        })
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.error(err))
}

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
        .then(product => {
            res.render('admin/products', {
                prods: product,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            })
        })
        .catch(err => console.err(err))
}

exports.postDeleteProduct = (req, res, next) => {
    Product.findByPk(req.body.productId)
        .then(product => {
            return product.destroy()
        })
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.error(err))
}