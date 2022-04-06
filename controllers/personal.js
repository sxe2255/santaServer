const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const keys = require('../config/keys');
const userHistorySchema = require('../models/History');

const userModel = require('../models/User');
const errorHandler = require('../utilites/errorhandlers');

module.exports.owerview = async function(req,res){
    let dateHistory = {
        '0': 0,
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        '6': 0,
        '7': 0,
        '8': 0,
        '9': 0,
        '10': 0,
        '11': 0
    };
    let date = new Date();
    const allUserhistory = await userHistorySchema.find({});
    allUserhistory.forEach(element => {
        let dateCollect = new Date(element.date);
        if(dateCollect.getFullYear() === date.getFullYear()){
                dateHistory[dateCollect.getMonth()] +=1;
        }
    });

    const decodedToken = await jwt.verify(req.headers.authorization.slice(7), keys.jwt);
    const allUsersWithoutWhoGets = await userModel.find({_id:{$ne: decodedToken.userId}});
    const personalData = await userModel.findOne({_id:decodedToken.userId}, {password:0});
    personalData._doc.allUser = allUsersWithoutWhoGets.length;
    personalData._doc.dateHistory = dateHistory;
    if(personalData.whoGets!=''){
        const whoGetsData = await userModel.findOne({_id:personalData.whoGets}, {password:0});
        personalData._doc.dataWhoGets = whoGetsData
    }
    res.status(200).json(personalData);
}

module.exports.update = async function(req,res){
    const decodedToken = await jwt.verify(req.headers.authorization.slice(7), keys.jwt);
    for(let keyReq in req.body){
        try{
            await userModel.updateOne({_id: decodedToken.userId}, {$set:{[keyReq]: req.body[keyReq]},function(err, result){     
                console.log(result);
                console.log(err)
            }});
        }
        catch(err){
            errorHandler(res, error)
        }
    }
    const personalData = await userModel.findOne({_id:decodedToken.userId}, {password:0});
    res.status(200).json(personalData);   
}

module.exports.santa = async function(req,res){
    
    
    const decodedToken = jwt.verify(req.headers.authorization.slice(7), keys.jwt);
    const allUsersWithoutWhoGets = await userModel.find({_id:{$ne: decodedToken.userId}, whoSends: {$eq: ''}});
    const personalData = await userModel.findOne({_id:decodedToken.userId}, {password:0});
    if(!personalData.whoGets){
        if(allUsersWithoutWhoGets.length === 0){
            res.status(200).json({message: 'User Without Who Gets not found'})
        }
        else{
            let randomNumber = 0;
            if(allUsersWithoutWhoGets.length !== 1){
                function randomNumberGen(min, max){
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
                randomNumber = randomNumberGen(0,allUsersWithoutWhoGets.length);
            }
            try{
                await userModel.updateOne({_id: allUsersWithoutWhoGets[randomNumber]._id}, {$set:{ whoSends: decodedToken.userId}}); // Добавление кто отправаляет
                await userModel.updateOne({_id: decodedToken.userId}, {$set:{ whoGets: allUsersWithoutWhoGets[randomNumber]._id}});//тот кто нажал на кнопку Добавление кому отправить
            }
            catch(error){
                errorHandler(res, error)
            }

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: keys.sendMail.email,
                pass: keys.sendMail.password,
                },
            })
            try{
                await transporter.sendMail({
                    from: '"Santa" <sxe8.91@gmail.com>',
                    to: decodedToken.email,
                    subject: 'Кому отправить подарок',
                    text: `Привет отправляй подарок для ${allUsersWithoutWhoGets[randomNumber].firstName} ${allUsersWithoutWhoGets[randomNumber].lastName} по адрессу: ${allUsersWithoutWhoGets[randomNumber].address}`
                })
            }
            catch(error){
                errorHandler(res, error)
            }
            res.status(200).json(personalData);
        }
    }else{
        res.status(200).json({message: 'You have userSend'});
    }
}



