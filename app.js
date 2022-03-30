const express = require('express');
const app = express();
require('dotenv/config'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.options('*', cors())

//moddleware
app.use(express.json());
app.use(morgan('tiny'));
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

//Routes
const categoriesRoutes = require('./routes/categories');
const foodsRoutes = require('./routes/foods');
const restaurantsRoutes = require('./routes/restaurants');
const ordersRoutes = require('./routes/orders');
const usersRoutes = require('./routes/users');
//const transactionsRoutes = require('./routes/transactions')


const api = process.env.API_URL;

app.use(`${api}/categories`,categoriesRoutes);
app.use(`${api}/foods`, foodsRoutes);
app.use(`${api}/restaurants`, restaurantsRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/users`, usersRoutes);
//app.use(`${api}/transactions`, transactionsRoutes);

//Database connection
mongoose.connect(
    process.env.
    //online connection string 
    /*XCONNECTION_STRING*/
    //offline connection string 
    //CONNECTION_STRING
    XCONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'food-database'
}).then(() => {
    console.log('Database Connection is ready...')
}).catch((err) => {
    console.log(err);
})

app.listen(3000, ()=>{
    console.log('server is running http://localhost:3000');
})