import express from 'express'
import bodyParser from 'body-parser'
import calculateRouter from './routes/calculate.route'

const app = express();
const PORT = process.env.PORT || 6000;

app.use(bodyParser.json());
app.use(calculateRouter);

app.listen(PORT, () => console.log(`gke-file-gateway listening on port ${PORT}!`))