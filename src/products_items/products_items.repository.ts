const db = require("../db");
class ProductsItemsRepository {
  static postProductItem(url: string, product_id: number) {
    // console.log(url)
    // console.log(product_id)
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO products_items(url, product_id) VALUES ($1, $2) RETURNING *",
        [url, product_id],
        (error: any, results: any) => {
          if (error) {
            reject(error);
          } else {
            const data = results.rows[0];
            resolve(data);
          }
        }
      );
    });
  }

  static getItemsFromProduct(product_id: number) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM products_items WHERE product_id = $1",
        [product_id],
        (error: any, results: any) => {
          if (error) {
            reject(error);
          } else {
            const data = results.rows;
            resolve(data);
          }
        }
      );
    });
  }

  static getProductItemById(id: number) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM products_items WHERE product_item_id = $1",
        [id],
        (error: any, results: any) => {
          if (error) {
            reject(error);
          } else {
            const data = results.rows[0];
            resolve(data);
          }
        }
      );
    });
  }

  static getByIdOneToMany(id: number, product_id: number) {
    // Получение записи по первичному и внешнему ключу для валидации
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM products_items WHERE product_id = $1 AND product_item_id = $2",
        [product_id, id],
        (error: any, results: any) => {
          if (error) {
            reject(error);
          } else {
            const data = results.rows[0];
            resolve(data);
          }
        }
      );
    });
  }

  static deleteProductItem(id: number) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM products_items WHERE product_item_id = $1",
        [id],
        (error: any, results: any) => {
          if (error) {
            reject(error);
          } else {
            const data = results.rows[0];
            resolve(data);
          }
        }
      );
    });
  }
}

module.exports = {
  ProductsItemsRepository,
};
export {};
