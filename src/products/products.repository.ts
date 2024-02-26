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

    static getProductById(id: number) {
        return new Promise((resolve, reject) => {
          db.query('SELECT * FROM products WHERE id = $1', [id], (error: any, results: any) => {
            if (error) {
              reject(error);
            } else {
              const data = results.rows[0];
              resolve(data);
            }
          });
        });
      }

    static updateProductById(id: number, title: string, url: string, description: string, category_id: number) {
        return new Promise((resolve, reject) => {
          db.query('UPDATE products set title = $1, url = $2, description = $4, category_id = $5 where id = $3 RETURNING *', [title, url, id, description, category_id], (error: any, results: any) => {
            if (error) {
              reject(error);
            } else {
              const data = results.rows[0];
              resolve(data);
            }
          });
        });
      }
    
    static updateProductByIdWithoutUrl(id: number, title: string, description: string, category_id: number) {
    return new Promise((resolve, reject) => {
        db.query('UPDATE products set title = $1, description = $2, category_id = $4  where id = $3 RETURNING *', [title, description, id, category_id], (error: any, results: any) => {
                if (error) {
                    reject(error);
                } else {
                    const data = results.rows[0];
                    resolve(data);
                }
            });
        });
    }

    static deleteById(id: number) {
        return new Promise((resolve, reject) => {
          db.query('DELETE FROM products where id = $1', [id], (error: any, results: any) => {
            if (error) {
              reject(error);
            } else {
              const data = results.rows[0];
              resolve(data);
            }
          });
        });
      }

}

module.exports = {
    ProductsRepository
}
