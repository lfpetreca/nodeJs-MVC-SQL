const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    Product.create({
        title: req.body.title,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        description: req.body.description
    })
        .then(result => {
            console.log('Create ')
            //res.redirect('/')
        })
        .catch(err => console.error(err))
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
            path: '/admin/edit-product',
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
    Product.findAll()
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
    Product.deleteById(req.body.productId)
    res.redirect('/admin/products')
}