const { ProductsItemsDAO } = require('./products_items.DAO')
const sharp = require('sharp')
const fs = require('fs')

class CustomError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

class ProductsItemsController {
    async postProductItem(req: any, res: any) {
        const { product_id } = req.body
        if (req.file) {
            await sharp(req.file.path)
            .toFile(`/usr/src/app/static/products_items/${req.file.originalname}`)

            const url = `https://partnerev.ru/static/products_items/${req.file.originalname}`

            fs.unlink(req.file.path, () => {
                console.log(req.file.path)
            })

            ProductsItemsDAO.postProductItem(url, product_id)
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

    async getItemsFromProduct(req: any, res: any) {
        const exteriorDesignId = req.params.id
        ProductsItemsDAO.getItemsFromProduct(exteriorDesignId)
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

    async deleteProductItem(req: any, res: any) {
        const { id } = req.params
        const product_id = req.query.product_id
        console.log('product_id', product_id)
        console.log(id)
        ProductsItemsDAO.deleteProductItem(id, product_id)
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

module.exports = new ProductsItemsController()
export {}