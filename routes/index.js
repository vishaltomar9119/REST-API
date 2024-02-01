var express = require('express');
var Router = express.Router();
var indexController = require('../controllers/indexController')
const bcrypt = require('bcrypt');

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhoneNumber(phoneNumber) {
  const phoneRegex = /^\+\d{10,}$/;
  return phoneRegex.test(phoneNumber);
}

function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/;
  return passwordRegex.test(password);
}

Router.get('/registration', async(req, res)=>{
    try{
        if (!name || !address || !email || !phone || !password || !photo) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
          }
        
          if (address.length < 10) {
            return res.status(400).json({ success: false, message: 'Address should be at least 10 characters' });
          }
        
          if (!validateEmail(email)) {
            return res.status(400).json({ success: false, message: 'should be a valid email address' });
          }
        
          if (!validatePhoneNumber(phoneNumber)) {
            return res.status(400).json({ success: false, message: 'should be at least 10 number + country code' });
          }
        
          if (!validatePassword(password)) {
            return res.status(400).json({ success: false, message: 'must contain one upper character, one lower character and a number. Max length 15 and min length 8' });
          }
        
          const hashedPassword = await bcrypt.hash(password, 10);

        var patient = nosql.model('Patient');
        var data  =  await patient.insertMany({ name:name , email:email ,password:hashedPassword ,address:address, phone:phone , photo:photo});
        if(data)
        res.send({status:true ,data:data});
        else res.send({status:false , data:[], msg:'data not insert'});

    }catch(err){
        res.send(err);
    }
})



Router.get('/get-information', async(req, res)=>{
  try{
    const hospitalId = "1";
    var hospital = nosql.model('Hospital')
    var data  = await hospital.aggregate([
  {
    $match: {hospitalId: hospitalId}
  },
  {
    $lookup: {from: "psychiatrists",  localField: "hospitalId",foreignField: "hospitalId",as: "psychiatrists"}
  },
  {
    $unwind: "$psychiatrists"
  },
  {$lookup: {  from: "patients",  localField: "psychiatrists.psychiatristID",  foreignField: "psychiatristId",  as: "patients"}},
  {
    $group: {_id: "$_id",  hospitalName: { $first: "$name" },psychiatristCount: { $sum: 1 },totalPatientsCount: { $sum: { $size: "$patients" } },
      psychiatrists: {
        $push: {
          id: "$psychiatrists._id",
          name: "$psychiatrists.name",
          patientsCount: { $size: "$patients" }
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      hospitalName: 1,
      psychiatristCount: 1,
      totalPatientsCount: 1,
      psychiatrists: 1
    }
  }
]);
if(data.length!=0)
res.send(data)
else
res.send({status:false , data:[], msg:'data not found'});

  }catch(err){
    res.send(err);
  }

});


module.exports = Router;
