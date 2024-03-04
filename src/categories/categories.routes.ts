const Router = require('express')
const router = new Router()
const categoriesController = require('./categories.controller')

router.get('/categories/:id', categoriesController.getCategoryById)

module.exports = router;
export {};
