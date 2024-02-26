const { CategoriesRepository } = require('./categories.repository')

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

    static async getCategoryIdByTitle(title: string) {
        await this._isTitleExist(title)
        return await CategoriesRepository.getCategoryIdByTitle(title)
    }
}

module.exports = {
    CategoriesDAO
}
export {}