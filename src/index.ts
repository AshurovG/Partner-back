// import express from 'express';
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const path = require('path')

// const productsRouter = require('./products/products.routes')
// const productsItemsRouter = require('./products_items/products_items.routes')
// const authRouter = require('./auth/auth.routes')
// const categoriesRouter = require('./categories/categories.routes')
// const emailRouter = require('./email/email.routes')

// const app = express();
// const PORT = 8000

// app.use("/static", express.static(path.join(__dirname, "static")))
// app.use(cors())
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json())

// app.use('/api', productsRouter)
// app.use('/api', productsItemsRouter)
// app.use('/api', authRouter)
// app.use('/api', categoriesRouter)
// app.use('/api', emailRouter)

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')
//const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');

const productsRouter = require('./products/products.routes')
const productsItemsRouter = require('./products_items/products_items.routes')
const authRouter = require('./auth/auth.routes')
const categoriesRouter = require('./categories/categories.routes')
const emailRouter = require('./email/email.routes')

const PORT = 8000
const app = express()

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/static", express.static(path.join(__dirname, "static")))
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

app.use('/api', productsRouter)
app.use('/api', productsItemsRouter)
app.use('/api', authRouter)
app.use('/api', categoriesRouter)
app.use('/api', emailRouter)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
