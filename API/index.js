const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');  // Import mongoose
const app = express();
const uri = "mongodb+srv://vinhntce171035:Vinh0945509444@cluster0.bc1fana.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const bcryptjs = require('bcryptjs');
const User = require('./models/User.js');
require('dotenv').config();

const bcryptSalt = bcryptjs.genSaltSync(10);

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));


mongoose.connect(uri);

app.get('/test', (req,res) => {
    res.json('test ok');
});

app.post('/register', async (req,res) => {
    const {name,email,password} = req.body;
    try{
        const userDoc = await User.create({
            name,
            email,
            password: bcryptjs.hashSync(password, bcryptSalt), 
        });
        res.json(userDoc);
    } catch(e) {
        res.status(422).json(e);
    }
   
    
});

app.listen(4000);
