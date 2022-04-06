const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const userModel = require('../models/User');
const userHistorySchema = require('../models/History');

const errorHandler = require('../utilites/errorhandlers');

module.exports.history = async function(req,res){
    const decodedToken = await jwt.verify(req.headers.authorization.slice(7), keys.jwt);
    const personalData = await userModel.findOne({_id:decodedToken.userId}, {password:0});
    let arrayHistory = await userHistorySchema.find({user_id:decodedToken.userId});
    let arrayHistoryLastFive = [];
    if(arrayHistory.length == 0){
        res.status(200).json(arrayHistoryLastFive);
    }else{
        for(let x = arrayHistory.length-1; x > arrayHistory.length-6; x--){
            arrayHistoryLastFive.push(arrayHistory[x]);
        }
        res.status(200).json(arrayHistoryLastFive);  
    }
}

module.exports.addhistory = async function(req,res){
    const date = new Date();
    let dateNow = Date.now();
    const decodedToken = await jwt.verify(req.headers.authorization.slice(7), keys.jwt);
    const personalData = await userModel.findOne({_id:decodedToken.userId}, {password:0});
    const personalDataWhoSends = await userModel.findOne({_id:personalData.whoGets}, {password:0});
    const user = new userHistorySchema({
        user_id: decodedToken.userId,
        userWhoGetGift_id: personalData.whoGets,
        userWhoGetGift_firstName: personalDataWhoSends.firstName,
        userWhoGetGift_lastName: personalDataWhoSends.lastName,
        date: `${date}` 
    })
    try{
        await user.save();
        userModel.updateOne(
            {_id: personalData.whoGets}, 
            { $set: {whoSends: ''}},
            function(err, result){
                console.log(result);
            }
        );
        userModel.updateOne(
            {_id: decodedToken.userId}, 
            { $set: {whoGets: ''}},
            function(err, result){
                console.log(result);
            }
        );
        res.status(200).json({message: 'send gift'});
    }
    catch(error){
        errorHandler(res, error)
    }
}