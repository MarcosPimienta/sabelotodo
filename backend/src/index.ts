import express from 'express';

const app = express();
const port = 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, this is the backend server!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
