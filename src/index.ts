import express from 'express';
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')

const productsRouter = require('./products/products.routes')
const productsItemsRouter = require('./products_items/products_items.routes')
const authRouter = require('./auth/auth.routes')
// const emailRouter = require('./email/email.controller')

const app = express();
const PORT = 8000

app.use("/static", express.static(path.join(__dirname, "static")))
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

app.use('/api', productsRouter)
app.use('/api', productsItemsRouter)
app.use('/api', authRouter)
// app.use('/api', emailRouter)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
