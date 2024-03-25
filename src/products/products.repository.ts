const db = require('../db')
const { ProductsItemsDAO } = require("../products_items/products_items.DAO");

class ProductsRepository {
    static postProduct(title: string, url: string, itemUrl: string, description: string, category_id: number) {
      return new Promise((resolve, reject) => {
        db.query('INSERT INTO products(title, url, description, category_id) VALUES ($1, $2, $3, $4) RETURNING *', [title, url, description, category_id], (error: any, results: any) => {
          if (error) {
            reject(error);
          } else {
            const data = results.rows[0];
	    ProductsItemsDAO.postProductItem(itemUrl, data.product_id);
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
        db.query('SELECT * FROM products WHERE product_id = $1', [id], (error: any, results: any) => {
          if (error) {
            reject(error);
          } else {
            const data = results.rows[0];
            resolve(data);
          }
        });
      });
    }

    static getProductFromCategory(category_id: number) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM products WHERE category_id = $1', [category_id], (error: any, results: any) => {
          if (error) {
            reject(error);
          } else {
            const data = results.rows;
            resolve(data);
          }
        });
      });
    }
	
    static updateProductById(id: number, title: string, url: string, description: string) {
        return new Promise((resolve, reject) => {
          db.query('UPDATE products set title = $1, url = $2, description = $4 where product_id = $3 RETURNING *', [title, url, id, description], (error: any, results: any) => {
            if (error) {
              reject(error);
            } else {
              const data = results.rows[0];
              resolve(data);
            }
          });
        });
      }
    
    static updateProductByIdWithoutUrl(id: number, title: string, description: string) {
    return new Promise((resolve, reject) => {
        db.query('UPDATE products set title = $1, description = $2  where product_id = $3 RETURNING *', [title, description, id], (error: any, results: any) => {
                if (error) {
                    reject(error);
                } else {
                    const data = results.rows[0];
                    resolve(data);
                }
            });
        });
    }

    static deleteProductById(id: number) {
        return new Promise((resolve, reject) => {
          db.query('DELETE FROM products where product_id = $1', [id], (error: any, results: any) => {
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
export {}
