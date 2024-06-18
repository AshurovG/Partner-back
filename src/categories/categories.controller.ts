const { CategoriesDAO } = require("./categories.DAO");

class CategoriesController {
  async getCategoryById(req: any, res: any) {
    const { id } = req.params;
    CategoriesDAO.getCategoryById(id)
      .then((data: any) => {
        // console.log('data', data)
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

module.exports = new CategoriesController();
export {};
