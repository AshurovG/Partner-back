const Router = require('express');
const multer = require('multer');
const router = new Router()


const productsItemsController = require('./products_items.controller')

const MAX_SIZE = 5000000

const upload = multer({
    dest: 'files/',
    limits: {
        fileSize: MAX_SIZE
    }
})

router.post('/products_items', upload.single('file'), productsItemsController.postProductItem)
router.get('/products_items/:id', productsItemsController.getItemsFromProduct)
router.delete('/products_items/:id', productsItemsController.deleteProductItem)

module.exports = router;
export {};