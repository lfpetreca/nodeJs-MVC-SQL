const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(
        null,
        req.body.title,
        req.body.imageUrl,
        req.body.description,
        req.body.price
    )
    product.save()
    res.redirect('/')
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit

    if (!editMode) {
        return res.redirect('/')
    }

    const prodId = req.params.productId
    Product.findById(prodId, product => {
        if (!product) {
            return res.redirect('/')
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '',
            editing: editMode,
            product: product
        })
    })
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId
    
    const updateProduct = new Product(
        prodId,
        req.body.title,
        req.body.imageUrl,
        req.body.description,
        req.body.price
    )
    updateProduct.save()
    res.redirect('/admin/products')
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