import express from 'express';
import productsRouter from "./routes/products.routes.js";
import usersRouter from "./routes/users.routes.js";

const app = express();
app.use(express.json());
const PORT = 3000;

app.use('/users', usersRouter);

app.use('/products', productsRouter);

app.listen(PORT, () => console.log(`Server rodando em http://localhost:${PORT}`));
