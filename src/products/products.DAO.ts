const { ProductsRepository } = require('./products.repository')
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

    static async _validate(product: ProductData) { // Проверка на определенность каждого параметра
        if (await (product.title === undefined ||
            product.url === undefined ||
            product.description === undefined)
        ) {
            let error = new CustomError('invalidate exterior design data', 400);
            throw error
        }
    }

    static async postProduct(title: string, url: string, description: string, category_id: number) {
        await this._validate({ title, url, description })
        await this._validateId(category_id)
        return await ProductsRepository.postProduct(title, url, description, category_id)
    }

    static async getProducts() {
        try {
            const query = await ProductsRepository.getProducts()
            return query
        } catch (error) {
            throw error
        }
    }
}

module.exports = {
    ProductsDAO
}