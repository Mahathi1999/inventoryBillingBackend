// server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

const PORT=process.env.PORT || 5000

// Set up middleware and routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
//enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
// Define the schema for the product model
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
});

const Product = mongoose.model('Product', productSchema);

// API route to get all products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// API route to add a new product
app.post('/api/products', async (req, res) => {
  const { name, price, quantity } = req.body;
  const product = new Product({
    name,
    price,
    quantity,
  });
  await product.save();
  res.json(product);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
