const db = require('../db')

class CategoriesRepository {
    static getCategoryIdByTitle(title: string) {
        return new Promise((resolve, reject) => {
            db.query('SELECT category_id FROM categories WHERE title = $1', [title], (error: any, results: any) => {
            if (error) {
                reject(error);
            } else {
                const data = results.rows[0].category_id;
                resolve(data);
            }
            });
      });
    }

    static getCategoriesTitles() {
        return new Promise((resolve, reject) => {
            db.query('SELECT title FROM categories', (error: any, results: any) => {
            if (error) {
                reject(error);
            } else {
                const data = results.rows;
                resolve(data.map((item: {title: string}) => {
                    return item.title
                }));
            }
            });
      });
    }
}

module.exports = {
    CategoriesRepository
}
export {}