'use strict'


const express = require('express');

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT 

const mongoose = require('mongoose');

mongoose.connect('mongodb://Suzan:1234@cluster0-shard-00-00.nhjbu.mongodb.net:27017,cluster0-shard-00-01.nhjbu.mongodb.net:27017,cluster0-shard-00-02.nhjbu.mongodb.net:27017/fruits?ssl=true&replicaSet=atlas-9b55li-shard-0&authSource=admin&retryWrites=true&w=majority');


const FruitSchema = new mongoose.Schema({
    name : String ,
    image : String ,
    price : Number
})

const UserSchema = new mongoose.Schema({
   email :{type :String , unique: true , required : true  }  ,
    fruits : [FruitSchema]
})

const UserModel = mongoose.model('fruits' , UserSchema)

const seedfunc = ()=>{
    let suzan = new UserModel({
        email : 'suzanhiary4@gmail.com',
        fruits :[

            {
                "name": "Pineapple",
                "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Pineapple_and_cross_section.jpg/286px-Pineapple_and_cross_section.jpg",
                "price": 20
                },
                {
                "name": "Strawberry",
                "image": "http://d20aeo683mqd6t.cloudfront.net/articles/title_images/000/039/158/medium/shutterstock_142361884.jpg?2019",
                "price": 36
                },

        ]
    });
    suzan.save().then(()=>console.log('done')).catch(()=>console.log('doublcated'))
}
seedfunc()




const getAllFruits = (req,res)=>{
    axios.get('https://fruit-api-301.herokuapp.com/getFruit')
    .then(response=>{
        res.send(response.data)
    })
}


const getfavlist=(req,res)=>{
    let email = req.params.email ;

UserModel.findOne({email:email} , (err ,docs)=>{
    if(err){
        res.send(error.message)
    }else{
        res.send(docs)
    }
})

}


const posttofav =(req, res)=>{
    let email = req.params.email ;
    let{name , image , price} = req.body ;

    let data={
        name : name ,
        image : image ,
        price : price 
    }
    console.log(data)

    UserModel.findOne({email:email} , (err,user)=>{
       user.fruits.push(data) ;
       user.save();
       res.send(user)
    })

}

const deletefav=(req, res)=>{
    let id = req.params.id;
    let email = req.params.email ;
    UserModel.findOne({email:email} , (err,user)=>{
       user.fruits.splice(id , 1)
       user.save();
       res.send(user)
    })

}

const updatefav=(req,res)=>{
    let id = req.params.id;
    let{name , image , price} = req.body ;
    let data={
        name : name ,
        image : image ,
        price : price 
    }
    UserModel.findOne({id:id} , (err,user)=>{
        user.fruits.splice(id , 1 , data)
        user.save();
        res.send(user)
     })

}
app.get('/fruits' , getAllFruits);
app.get('/favlist/:email' , getfavlist);
app.post('/favlist/:email' , posttofav) ;
app.delete('/delete/:email/:id' , deletefav);
app.put('/update/:id' , updatefav)

app.listen(PORT , ()=>{
    console.log(`listen to ${PORT}`)
})