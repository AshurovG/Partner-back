const db = require('../db')

class ProductsRepository {
    static postProduct(title: string, url: string, description: string, category_id: number) {
        return new Promise((resolve, reject) => {
          db.query('INSERT INTO products(title, url, description, category_id) VALUES ($1, $2, $3, $4) RETURNING *', [title, url, description, category_id], (error: any, results: any) => {
            if (error) {
              reject(error);
            } else {
              const data = results.rows[0];
              resolve(data);
            }
          });
        });
    }

    static getProducts() {
        return new Promise((resolve, reject) => {
          db.query('SELECT * FROM products', (error: any, results: any) => {
            if (error) {
              reject(error);
            } else {
              const data = results.rows;
              resolve(data);
            }
          });
        });
    }
}

module.exports = {
    ProductsRepository
}
