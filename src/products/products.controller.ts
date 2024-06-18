const { ProductsDAO } = require("./products.DAO");
const { ProductsItemsDAO } = require("../products_items/products_items.DAO");
const sharp = require("sharp");
const fs = require("fs");

class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class ProductsController {
  async postProduct(req: any, res: any) {
    const { title, description, category_id } = req.body;
    // console.log(`/usr/src/app/static/products/${req.file.originalname}`)
    if (req.file) {
      await sharp(req.file.path).toFile(
        `/usr/src/app/static/products/${req.file.originalname}`
      );

      await sharp(req.file.path).toFile(
        `/usr/src/app/static/products_items/${req.file.originalname}`
      );

      const url = `https://partnerev.ru/static/products/${req.file.originalname}`;
      const itemUrl = `https://partnerev.ru/static/products_items/${req.file.originalname}`;

      //        fs.unlink(req.file.path, () => {
      //              console.log(req.file.path)
      //            })

      ProductsDAO.postProduct(title, url, itemUrl, description, category_id)
        .then((data: any) => {
          res.json(data);
        })
        .catch((error: CustomError) => {
          if (error.status === 500) {
            res
              .status(500)
              .send({ status: "Problem", message: "Problem with database" });
          } else {
            res
              .status(400)
              .send({ status: "Bad Request", message: error.message });
          }
        });
    } else {
      res
        .status(400)
        .send({ status: "Bad Request", message: "File was not sent" });
    }
  }

  async getProducts(req: any, res: any) {
    ProductsDAO.getProducts()
      .then((data: any) => {
        res.json(data);
      })
      .catch((error: CustomError) => {
        if (error.status === 500) {
          res
            .status(500)
            .send({ status: "Problem", message: "Problem with database" });
        } else {
          res
            .status(400)
            .send({ status: "Bad Request", message: error.message });
        }
      });
  }

  async getProductById(req: any, res: any) {
    const id = req.params.id;
    let items: any[] = [];
    ProductsItemsDAO.getItemsFromProduct(id)
      .then((data: any) => {
        items = data;
      })
      .catch(() => {
        return;
      });
    ProductsDAO.getProductById(id)
      .then((data: any) => {
        data.items = items;
        // console.log(data)
        res.json(data);
      })
      .catch((error: CustomError) => {
        if (error.status === 404) {
          res
            .status(error.status)
            .send({ status: "Not found", message: error.message });
        } else if (error.status === 500) {
          res
            .status(500)
            .send({ status: "Problem", message: "Problem with database" });
        } else {
          res
            .status(400)
            .send({ status: "Bad Request", message: error.message });
        }
      });
  }

  async getProductFromCategory(req: any, res: any) {
    const { title } = req.query;
    ProductsDAO.getProductFromCategory(title)
      .then((data: any) => {
        res.json(data);
      })
      .catch((error: CustomError) => {
        if (error.status === 404) {
          res
            .status(error.status)
            .send({ status: "Not found", message: error.message });
        } else if (error.status === 500) {
          res
            .status(500)
            .send({ status: "Problem", message: "Problem with database" });
        } else {
          res
            .status(400)
            .send({ status: "Bad Request", message: error.message });
        }
      });
  }

  async updateProductById(req: any, res: any) {
    const { title, description, imgUrl, isFileChanged } = req.body;
    const { id } = req.params;
    if (isFileChanged == 1) {
      let deletingFilePath = "";
      const searchString = "ru/";
      const startIndex = imgUrl.indexOf(searchString) + searchString.length;
      deletingFilePath = imgUrl.substring(startIndex);
      fs.unlink(deletingFilePath, () => {
        // Для удаления cтарых файлов
        // console.log(deletingFilePath)
      });
      await sharp(req.file.path).toFile(
        `/usr/src/app/static/products/${req.file.originalname}`
      );
      const url = `https://partnerev.ru/static/products/${req.file.originalname}`;
      fs.unlink(req.file.path, () => {
        // Для удаления закодированных файлов после использования
        // console.log(req.file.path)
      });
      ProductsDAO.updateProductById(id, title, url, description)
        .then((data: any) => {
          res.json(data);
        })
        .catch((error: CustomError) => {
          if (error.status === 404) {
            res
              .status(error.status)
              .send({ status: "Not found", message: error.message });
          } else if (error.status === 500) {
            res
              .status(500)
              .send({ status: "Problem", message: "Problem with database" });
          } else {
            res
              .status(400)
              .send({ status: "Bad Request", message: error.message });
          }
        });
    } else {
      ProductsDAO.updateProductByIdWithoutUrl(id, title, description)
        .then((data: any) => {
          res.json(data);
        })
        .catch((error: CustomError) => {
          if (error.status === 404) {
            res
              .status(error.status)
              .send({ status: "Not found", message: error.message });
          } else if (error.status === 500) {
            res
              .status(500)
              .send({ status: "Problem", message: "Problem with database" });
          } else {
            res
              .status(400)
              .send({ status: "Bad Request", message: error.message });
          }
        });
    }
  }

  async deleteProductById(req: any, res: any) {
    const id = req.params.id;
    ProductsDAO.deleteProductById(id)
      .then(() => {
        res.json("Запись удалена из БД !");
      })
      .catch((error: CustomError) => {
        if (error.status === 404) {
          res
            .status(error.status)
            .send({ status: "Not found", message: error.message });
        } else if (error.status === 500) {
          res
            .status(500)
            .send({ status: "Problem", message: "Problem with database" });
        } else {
          res
            .status(400)
            .send({ status: "Bad Request", message: error.message });
        }
      });
  }
}

module.exports = new ProductsController();
