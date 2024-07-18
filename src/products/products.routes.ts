const Router = require('express')
const router = new Router()
const multer = require('multer');
const productsController = require('./products.controller')

const MAX_SIZE = 10485760

const upload = multer({
    dest: 'files/',
    limits: {
        fileSize: MAX_SIZE
    }
})

router.post('/products', upload.single('file'), productsController.postProduct)
router.get('/products', productsController.getProducts)
router.get('/products/:id', productsController.getProductById)
router.get('/products_from_category', productsController.getProductFromCategory)
router.put('/products/:id', upload.single('file'), productsController.updateProductById)
router.delete('/products/:id', productsController.deleteProductById)

module.exports = router;
export {};
