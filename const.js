const express = require('express');
const mongoose = require('mongoose');
const cors =  require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017',

{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    upi_id: {type: String, unique: true},
    balance: {type: Number}
});

const user =mongoose.model('User', userSchema);


const transactionSchema = new mongoose.Schema({
    sender_upi_id: {type: String, required: true},
    receiver_upi_id: {type: String, required: true},
    amount: {type: String, required: true},
    timestamp: {type: Number, required: true},
});


const Transaction = mongoose.model('Transaction', transactionSchema);


const generateUPI = () => {
    const randomId = crypto.randomBytes(4).toString('hex');
    return `${randomId}@fastpay`;
};


app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;


        let user = await UserActivation.findOne({email});
        if (user) {
            return res.status(400).send({ message: 'User already exists'});
        }


        const upi_id = generateUPI();
        const balance = 1000;


        user = new UserActivation({ name, email, password, upi_id, balance});
        await user.save();
        res.status(201).send({ message: 'User Registered Successfully', upi_id});
    }catch(error){
        console.error(error);
        res.status(500).send({ message: 'Server ERROR'});
    }

});
