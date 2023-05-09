const User = require("../Models/customerModel")
const bcrypt = require('bcrypt')
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const { async } = require("react-input-emoji");
const bodyparser = require('body-parser')
const { cloudinary } = require('../cloudinary/index')


// Add customer

const addUser = async (req, res) => {
    console.log('qqqqqq');
    const { Name, MobileNo, Address, GivenAmount, TotalAmount, CollectionAmount, IdProof, Photo, InterestAmount,
        InterestPercentage, collectionDate,collectionPeriod,collectionEndDate } = req.body;
       console.log(req.body);
    try {
        const newUser = new User({
            Name,
            MobileNo,
            Address,
            GivenAmount,
            TotalAmount,
            InterestAmount,
            InterestPercentage,
            CollectionAmount,
            IdProof,
            Photo,
            collectionDate,
            collectionPeriod,
            collectionEndDate

        });
    
        await newUser.save();
        res.status(201).json(newUser); // Return the newly created user object in the response
        console.log(newUser,"saved");

    }
    catch (error) {
        res.status(500).json(error);
    }
};


// customer details

const getUser = async (req, res) => {

    const id = req.params.id;

    try {

        const userDetails = await User.findById(id)
        if (userDetails) {

            res.status(200).json(userDetails)
        }
        else {
            res.status(404).json("No Details found");
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


// All customers

const allUsers = async (req, res) => {

    try {
        let users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
};


// Collection List

const collectionList=async(req,res)=>{
   const user=await User.find()
   
   const {collectionDate,collectionEndDate,collectionPeriod}=user
    const date = require('date-and-time')

    // Creating object of current date and time 
    // by using Date() 
    const now = new Date();

    // Adding Days to the existing date and time
    // by using date.addDays() method
    const value = date.addDays(now, 24);

    // Display the result
    console.log("updated date and time : " + value)

}


// delete customer

const deleteUser = async (req, res) => {
    const id = req.params.id
    try {
        await User.findByIdAndDelete(id)
        res.status(200).json("customer deleted")
    } catch (error) {
        res.status(500).json(error)

    }
}


//update customer

const updateUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json({ user });
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}


// pay

const pay = async (req, res) => {
    const userId = req.params.id;
    const amount = req.body

    try {
        if (amount < CollectionAmount) {
            await User.findByIdAndUpdate(userId, { $push: { Pending: userId } })
            res.status(200).json("Amount is pending")


        } else {
            await User.findByIdAndUpdate(userId, { $push: { Collected: userId } })
            res.status(200).json("Paid")

        }
    } catch {
        console.log(error)
        res.status(500).json(error)
    }

}

module.exports = { addUser, getUser, allUsers, deleteUser, updateUser, pay,collectionList }