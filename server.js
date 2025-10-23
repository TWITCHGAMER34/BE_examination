import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import authRouter from './routes/auth.js';
import menuRouter from './routes/menu.js';
import cartRouter from './routes/cart.js';
import orderRouter from './routes/orders.js';

import errorHandler from './middlewares/errorHandler.js';

// Config
dotenv.config();
const app = express();

const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: { title: 'BE_examination API', version: '1.0.0' }
    },
    apis: ['./routes/*.js', './swagger.yaml'] // include route JSDoc or YAML
});

// Middlewares
app.use(express.json());


app.use(
    session({
        name: process.env.SESSION_NAME || 'sid',
        secret: process.env.SESSION_SECRET || 'change-me',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 // 1 hour
        }
    })
);

await connectDB();
// Routes
app.use('/api/auth', authRouter);
app.use('/api/menu', menuRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.listen(process.env.PORT || 5000, () => console.log('Server listening'));

app.use(errorHandler);