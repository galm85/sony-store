const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4001;

const categoriesRoute = require('./routes/categorieRoute');
const productsRoute = require('./routes/productsRoute');
const usersRoute = require('./routes/usersRoute');
const ordersRoute = require('./routes/ordersRoute');
const messagesRoute = require('./routes/messagesRoute');

mongoose.connect(process.env.MONGO_URI,{
    useFindAndModify:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(console.log('Connect to MongoDB')).catch(error=>console.log(error));



app.use(cors());
app.use(express.json({limit:"20mb"}));
app.use('/uploads',express.static('uploads'));


app.use('/categories',categoriesRoute);
app.use('/products',productsRoute);
app.use('/users',usersRoute);
app.use('/orders',ordersRoute);
app.use('/messages',messagesRoute);

app.get('/',(req,res)=>{
    res.send("Sony");
})


app.listen(PORT,()=>console.log(`Server is running on port: ${PORT}`));



