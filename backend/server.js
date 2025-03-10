const express=require('express');
const mongoose =require('mongoose');
const dotenv =require('dotenv');
const itemRoutes=require('./routes/itemRoutes');
const cors=require('cors');

dotenv.config();
const app =express();
app.use(cors({
        origin:'*',
        methods:"GET,POST,PUT,PATCH,DELETE",
        allowedHeaders:'Content-Type'}));


app.use(express.json());


mongoose.connect(process.env.MONGO_URI||'mongodb://localhost:27017/inventory').then(()=>console.log('Connect to Mongodb')).catch(err=>console.error(err));

app.use('/api/items',itemRoutes);
const port=process.env.PORT || 5000;
app.listen(port,()=>console.log(`Server is running on port${port}`));