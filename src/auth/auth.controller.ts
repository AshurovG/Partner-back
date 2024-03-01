const bcrypt = require('bcryptjs');
const dotenv = require('dotenv')
dotenv.config()

class AuthController {
    async login(req: any, res: any) {
        try {
            const { password } = req.body;
            const storedHash = '$2a$07$SsWkFLeOg1pXxxBxLZCvd.IyjJyNVH1PctkYA.wOBlJS5aAmywtTK';

            if (bcrypt.compareSync(password, storedHash)) {
                res.status(200).json({ message: 'Authentication successful', token: process.env.JWT_TOKEN });
            } else {
                res.status(401).json({ message: 'Invalid password' });
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal Server Error', error: (e as any).toString() });
        }
    }

    async check(req: any, res: any) {
        console.log('aaauuttth')
        try {
            const { token } = req.body
            if (token === process.env.JWT_TOKEN) {
                res.status(200).json({ message: 'success' });
            } else {
                res.status(401).json({ message: 'Invalid JWT' });
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal Server Error', error: (e as any).toString() });
        }
    }
}
module.exports = new AuthController()
export {}