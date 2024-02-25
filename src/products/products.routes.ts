const Router = require('express')
const router = new Router()
const multer = require('multer');
const productsController = require('./products.controller')

const MAX_SIZE = 2000000

const upload = multer({
    dest: 'files/',
    limits: {
        fileSize: MAX_SIZE
    }
})

router.post('/products', upload.single('file'), productsController.postProduct)
router.get('/products', productsController.getProducts)

module.exports = router