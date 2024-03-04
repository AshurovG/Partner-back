const { CategoriesRepository } = require('./categories.repository')
const { ProductsRepository } = require('../products/products.repository')

class CustomError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

class CategoriesDAO {
    title: string

    constructor(title: string) {
        this.title = title;
    }

    static async _isTitleExist(title: string) {
        const categories = await CategoriesRepository.getCategoriesTitles()
        if (categories.includes(title)) {
            return
        } else {
            throw new CustomError('No such category found', 404);
        }
        // console.log('fdfsdf', await CategoriesRepository.getCategoriesTitles())
    }

    static async _isExistsId(id: number) { // Проверка на наличие этого индекса в таблице
        if (await CategoriesRepository.getCategoryById(id) === undefined) {
            let error = new CustomError('no such id found', 404)
            throw error
        }
    }

    static _validateId(id: any) {
        if (isNaN(id) || id <= 0) {
            let error = new CustomError('invalid id', 400)
            throw error
        }
    }

    static async getCategoryIdByTitle(title: string) {
        await this._isTitleExist(title)
        return await CategoriesRepository.getCategoryIdByTitle(title)
    }

    static async getCategoryById(id: number) {
        const products = await ProductsRepository.getProductFromCategory(id)
        // console.log(products)
        try {
            await this._isExistsId(id)
            await this._validateId(id)
            const query = await CategoriesRepository.getCategoryById(id)
            query.products = products
            console.log(query)
            return query
        } catch (error) {
            throw error
        }
    }
}

module.exports = {
    CategoriesDAO
}
export {}
