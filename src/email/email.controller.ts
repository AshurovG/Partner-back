// const formData = require('form-data');
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

class EmailController {
  async sendEmail(req: any, res: any) {
    try {
      const { fio, email, description } = req.body;

      const htmlContent = `
                <h1>Новое обращение с сайта!</h1>
                <p>ФИО отправителя: ${fio}</p>
                <p>Номер телефона отправителя: ${email}</p>
                <p>Описание обращения: ${description}</p>
            `;
      await axios("https://api.unisender.com/ru/api/sendEmail", {
        params: {
          format: "json",
          api_key: "6bxx64y6snukps5zdyo5hem65xz4xogxr8x18uqe",
          email: "ashurov1308@gmail.com",
          sender_name: "Новый клиент",
          sender_email: "ashurov.g13@gmail.com",
          subject: "Вам поступило новое обращение",
          body: htmlContent,
          list_id: 1,
        },
        headers: {
          Origin: "https://api.unisender.com",
        },
      });
      res.send({ message: "success" });
    } catch (e) {
      res.status(500).json({
        message: "Internal Server Error",
        error: (e as any).toString(),
      });
    }
  }
}

module.exports = new EmailController();
export {};
