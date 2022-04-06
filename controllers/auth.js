const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const userModel = require('../models/User');

const errorHandler = require('../utilites/errorhandlers');

module.exports.login = async function(req,res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    const candidate = await userModel.findOne({email: req.body.email});
    if(candidate){
        const passwordResult = bcryptjs.compareSync(req.body.password, candidate.password);
        if(passwordResult){
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn:60*60});
            res.status(200).json({
                token: `Bearer ${token}`
            })
        }else{
            res.status(404).json({message: 'password invalid'});
        }
    }else{
        res.status(404).json({message: 'email not found'});
    }
}


module.exports.register = async function(req,res){
    const candidate = await userModel.findOne({email: req.body.email});
    if(candidate){
        res.status(409).json({message: 'User find'});
    }else{
        const salt = bcryptjs.genSaltSync(10);
        const password = req.body.password;
        const user = new userModel({
            email: req.body.email,
            password: bcryptjs.hashSync(password, salt),
            firstName: req.body.firstName,
            address: req.body.address,
            lastName: req.body.lastName
        })
        try{
            await user.save();
            res.status(201).json({message: 'User create'});
        }
        catch(error){
            errorHandler(res, error)
        }

    }
}