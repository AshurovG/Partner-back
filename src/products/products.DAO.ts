const { ProductsRepository } = require('./products.repository')
const { ProductsItemsDAO } = require('../products_items/products_items.DAO')
const { CategoriesDAO } = require('../categories/categories.DAO')
const fs = require('fs')
import { ProductData } from '../types'

class CustomError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

class ProductsDAO {
    id: number;
    title: string;
    url: string;
    description: string;

    constructor(id: number, title: string, url: string, description: string) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.description = description;
    }

    static _validateId(id: any) {
        if (isNaN(id) || id <= 0) {
            let error = new CustomError('invalid id', 400)
            throw error
        }
    }

    static async isExistsId(id: number) { // Проверка на наличие этого индекса в таблице
        if (await ProductsRepository.getProductById(id) === undefined) {
            let error = new CustomError('no such id found', 404)
            throw error
        }
    }

    static async _validate(product: ProductData) { // Проверка на определенность каждого параметра
        if (await (product.title === undefined ||
            product.url === undefined)
        ) {
            let error = new CustomError('invalidate product data', 400);
            throw error
        }
    }

    static async _validateWithoutUrl(title: string) { // Проверка на определенность каждого параметра
        if (await (title === undefined)
        ) {
            let error = new CustomError('invalidate product data', 400);
            throw error
        }
    }

    static async postProduct(title: string, url: string, itemUrl: string, description: string, category_id: number) {
        await this._validate({ title, url })
        await this._validateId(category_id)
        return await ProductsRepository.postProduct(title, url, itemUrl, description, category_id)
    }

    static async getProducts() {
        try {
            const query = await ProductsRepository.getProducts()
            return query
        } catch (error) {
            throw error
        }
    }

    static async getProductFromCategory(title: string) {
        try {
            if (!title) {
                throw new CustomError('title is empty', 400)
            }
            const category_id = await CategoriesDAO.getCategoryIdByTitle(title)
            const query = await ProductsRepository.getProductFromCategory(category_id)
            return query
        } catch (error) {
            throw error
        }
    }

    static async getProductById(id: number) {
        try {
            await this._validateId(id)
            await this.isExistsId(id)
            const query = await ProductsRepository.getProductById(id)
            return query
        } catch (error) {
            throw error
        }
    }


    static async updateProductById(id: number, title: string, url: string, description: string) {
        try {
            await this._validateId(id)
            await this.isExistsId(id)
            await this._validate({ title, url, description })
            return await ProductsRepository.updateProductById(id, title, url, description)
        } catch (error) {
            throw error
        }
    }

    static async updateProductByIdWithoutUrl(id: number, title: string, description: string) {
        try {
            await this._validateId(id)
            await this.isExistsId(id)
            await this._validateWithoutUrl(title)
            return await ProductsRepository.updateProductByIdWithoutUrl(id, title, description)
        } catch (error) {
            throw error
        }
    }

    static async deleteProductById(id: number) {
        try {
            const productItems = await ProductsItemsDAO.getItemsFromProduct(id)
            let json = JSON.parse(JSON.stringify(productItems));
            let itemUrl = ''
            for (let item of json) {
                itemUrl = item.url.substring(item.url.indexOf("static"))
                fs.unlink(itemUrl, () => { // Для удаления самих файлов картинок
                    console.log(itemUrl)
                })
            }

            const product = await this.getProductById(id)
            const fileUrl = product.url
            const newUrl = fileUrl.substring(fileUrl.indexOf("static"));
            fs.unlink(newUrl, () => {
                return
            })
            await this._validateId(id)
            await this.isExistsId(id)
            const query = await ProductsRepository.deleteProductById(id)
            return query
        } catch (error) {
            throw error
        }
    }
}

module.exports = {
    ProductsDAO
}
