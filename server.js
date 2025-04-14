const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory "database"
let products = [];
let currentId = 1;

// ✅ POST /products – Add a new product
app.post('/products', (req, res) => {
  const { name, price, stock } = req.body;

  if (!name || price == null) {
    return res.status(400).json({ message: 'Name and price are required.' });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: 'Price must be a positive number.' });
  }

  const newProduct = {
    id: currentId++,
    name,
    price,
    stock: typeof stock === 'number' ? stock : 0,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// ✅ GET /products – Retrieve all products
app.get('/products', (req, res) => {
  res.json(products);
});

// ✅ PUT /products/:id – Update product stock
app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  if (typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ message: 'Stock must be a non-negative number.' });
  }

  product.stock = stock;
  res.json({ message: 'Stock updated.', product });
});

// ✅ DELETE /products/:id – Remove a product
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const deleted = products.splice(index, 1);
  res.json({ message: 'Product deleted.', product: deleted[0] });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Inventory API running at http://localhost:${PORT}`);
});
