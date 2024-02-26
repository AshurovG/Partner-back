const { ProductsDAO } = require('./products.DAO')
const sharp = require('sharp')
const fs = require('fs')

class CustomError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

class ProductsController {
    async postProduct(req: any, res: any) {
        const { title, description, category_id } = req.body
        if (req.file) {
            await sharp(req.file.path)
            .toFile(`./static/products/${req.file.originalname}`)

            const url = `http://localhost:8000/static/products/${req.file.originalname}`
            fs.unlink(req.file.path, () => {
                console.log(req.file.path)
            })

            ProductsDAO.postProduct(title, url, description, category_id)
            .then((data: any) => {
                res.json(data)
            })
            .catch((error: CustomError) => {
                if (error.status === 500) {
                    res.status(500).send({ status: 'Problem', message: 'Problem with database' })
                } else {
                    res.status(400).send({ status: 'Bad Request', message: error.message })
                }
            });
        } else {
            res.status(400).send({ status: 'Bad Request', message: 'File was not sent' })
        }
    }

    async getProducts(req: any, res: any) {
        ProductsDAO.getProducts()
            .then((data: any) => {
                res.json(data)
            })
            .catch((error: CustomError) => {
                if (error.status === 500) {
                    res.status(500).send({ status: 'Problem', message: 'Problem with database' })
                } else {
                    res.status(400).send({ status: 'Bad Request', message: error.message })
                }
            });
    }

    async getProductById(req: any, res: any) {
        const id = req.params.id //id - из url страницы
        ProductsDAO.getProductById(id)
            .then((data: any) => {
                res.json(data)
            })
            .catch((error: CustomError) => {
                if (error.status === 404) {
                    res.status(error.status).send({ status: 'Not found', message: error.message })
                } else if (error.status === 500) {
                    res.status(500).send({ status: 'Problem', message: 'Problem with database' })
                } else {
                    res.status(400).send({ status: 'Bad Request', message: error.message })
                }
            });
    }

    async updateProductById(req: any, res: any) {
        const { title, description, category_id, imgUrl, isFileChanged } = req.body
        const { id } = req.params
        if (isFileChanged == 1) {
            const searchString = "8000/";
            const startIndex = imgUrl.indexOf(searchString) + searchString.length;
            const deletingFilePath = imgUrl.substring(startIndex);
            fs.unlink(deletingFilePath, () => { // Для удаления cтарых файлов
                console.log(deletingFilePath)
            })
            await sharp(req.file.path)
                .toFile(`./static/products/${req.file.originalname}`)
            const url = `http://localhost:8000/static/products/${req.file.originalname}`
            fs.unlink(req.file.path, () => { // Для удаления закодированных файлов после использования
                console.log(req.file.path)
            })
            ProductsDAO.updateProductById(id, title, url, description, category_id)
                .then((data: any) => {
                    res.json(data)
                })
                .catch((error: CustomError) => {
                    if (error.status === 404) {
                        res.status(error.status).send({ status: 'Not found', message: error.message })
                    } else if (error.status === 500) {
                        res.status(500).send({ status: 'Problem', message: 'Problem with database' })
                    } else {
                        res.status(400).send({ status: 'Bad Request', message: error.message })
                    }
                });
        } else {
            ProductsDAO.updateProductByIdWithoutUrl(id, title, description, category_id)
                .then((data: any) => {
                    res.json(data)
                })
                .catch((error: CustomError) => {
                    if (error.status === 404) {
                        res.status(error.status).send({ status: 'Not found', message: error.message })
                    } else if (error.status === 500) {
                        res.status(500).send({ status: 'Problem', message: 'Problem with database' })
                    } else {
                        res.status(400).send({ status: 'Bad Request', message: error.message })
                    }
                });
        }
    }

    async deleteProductById(req: any, res: any) {
        const id = req.params.id
        ProductsDAO.deleteProductById(id)
            .then(() => {
                res.json('Запись удалена из БД !')
            })
            .catch((error: CustomError) => {
                if (error.status === 404) {
                    res.status(error.status).send({ status: 'Not found', message: error.message })
                } else if (error.status === 500) {
                    res.status(500).send({ status: 'Problem', message: 'Problem with database' })
                } else {
                    res.status(400).send({ status: 'Bad Request', message: error.message })
                }
            });
    }
}

module.exports = new ProductsController()