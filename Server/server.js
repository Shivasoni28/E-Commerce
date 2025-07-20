const connectDB = require('./config/db');
const dotenv= require('dotenv');
const express = require('express');
const cors = require('cors');   
const productRoutes = require('./routes/productRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


app.use('/api/products', productRoutes);
app.use('/api/users',userRoutes);
app.use('/api/cart', cartRoutes);

app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => {    
    res.send('API is running...');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
