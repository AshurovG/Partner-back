const { ProductsItemsRepository } = require('./products_items.repository')
const fs = require('fs')
import { ProductItemData } from "../types"

class CustomError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

class ProductsItemsDAO {
    id: number
    url: string
    constructor(id: number, url: string) {
        this.id = id
        this.url = url
    }

    static _validateId(id: number) {
        console.log(id)
        if (isNaN(id) || id <= 0) {
            let error = new CustomError('invalid id', 400)
            throw error
        }
    }

    static async _validate(productItem: ProductItemData) { // Проверка на определенность каждого параметра
        if (await (productItem.url === undefined ||
            productItem.product_id === undefined)
        ) {
            let error = new CustomError('invalidate product item data', 400);
            throw error
        }
    }

    static async isExistsIdOneAndIdMany(idOne: number, idMany: number) { // Проверка на наличие обоих индексов в таблице
        if (await ProductsItemsRepository.getByIdOneToMany(idOne, idMany) === undefined) {
            let error = new CustomError('no such exterior_design_id or exterior_design_items_id found', 404)
            throw error
        }
    }

    static async _isExistsId(id: number) {
        if (await ProductsItemsRepository.getProductItemById(id) === undefined) {
            let error = new CustomError(`no such id found. id=${id}`, 404)
            throw error
        }
    }

    static async postProductItem(url: string, product_id: number) {
        await this._validate({ url, product_id })
        return await ProductsItemsRepository.postProductItem(url, product_id)
    }

    static async getItemsFromProduct(product_id: number) {
        try {
            await this._validateId(product_id)
            // await this._isExistsId(product_id)
            const query = await ProductsItemsRepository.getItemsFromProduct(product_id)
            return query
        } catch (error) {
            throw error
        }
    }

    static async deleteProductItem(product_id: number, id: number) {
        try {
            await this._validateId(id)
            await this._validateId(product_id)
            await this.isExistsIdOneAndIdMany(product_id, id)
            const productItem = await ProductsItemsRepository.getProductItemById(id)
            const fileUrl = productItem.url
            console.log('items are', productItem)
            const newUrl = fileUrl.substring(fileUrl.indexOf("static"));
            fs.unlink(newUrl, () => {
                return
            })
            const query = await ProductsItemsRepository.deleteProductItem(product_id, id)
            return query
        } catch (error) {
            console.log('catch')
            throw error
        }
    }
}

module.exports = {
    ProductsItemsDAO
}