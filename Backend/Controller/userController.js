const User = require("../Models/customerModel")
const mongoose = require("mongoose");
const bodyparser = require('body-parser')
const date = require('date-and-time')


// Add customer

const addUser = async (req, res) => {
    console.log('qqqqqq');
    const { Name, MobileNo, Address, GivenAmount, TotalAmount, CollectionAmount, IdProof, Photo, InterestAmount,
        InterestPercentage, collectionDate, collectionPeriod, collectionEndDate } = req.body;
        console.log(typeof IdProof);
    console.log(typeof Photo);

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
        console.log(newUser, "saved");

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

const collectionList = async (req, res) => {
    try {
        const users = await User.find();
        const allWeeks = [];

        users.forEach((user) => {
            const { collectionDate, collectionEndDate, id, TotalAmount, CollectionAmount } = user;
            console.log(id, "uuuu");
            console.log("amount", TotalAmount);

            const updatedDatesForUser = [];
            const today = new Date();

            let mainAmount=TotalAmount;
            let reducing=mainAmount-CollectionAmount;
            mainAmount=reducing;
            console.log("mainAmount",mainAmount);

            for (let date = new Date(collectionDate); date <= new Date(collectionEndDate); date.setDate(date.getDate() + 1)) {
                if ((date - new Date(collectionDate)) % (7 * 24 * 60 * 60 * 1000) === 0) {
                    const updatedDate = new Date(date);
                    updatedDatesForUser.push(updatedDate);

                    if (updatedDate.toDateString() === today.toDateString()) {
                        console.log(updatedDatesForUser, "upupup");
                    }
                }
            }

            allWeeks.push({
                userId: id,
                dates: updatedDatesForUser
            });

            console.log("updated dates for user:", updatedDatesForUser);
        });

        // const todayDates = allWeeks.filter((user) => user.dates.some((date) => date.toDateString() === new Date().toDateString())).map((user) => user.userId);
        const todayUsers = allWeeks.filter((user) => user.dates.some((date) => date.toDateString() === new Date().toDateString()));

        const todayDates = todayUsers.map((user) => ({
            date: user.dates.find((date) => date.toDateString() === new Date().toDateString()),
            userId: user.userId
        }));
        console.log("todayDates:", todayDates);
        

        res.status(201).json({
            allWeeks: allWeeks,
            todayDates: todayDates
        });
    } catch (error) {
        console.log(error);
    }
};

// pay

const pay = async (req, res) => {
    const userId = req.params.id;
    console.log(userId);
    const amount = req.body.CollectionAmount
    const user = await User.findById(userId)
    console.log(user);
    const { CollectionAmount } = user
    console.log("collection", CollectionAmount);
    console.log("amount", amount);
    try {
          const currentDate = new Date();
        if (amount < CollectionAmount) {
            const remaining = CollectionAmount - amount
            console.log(remaining);
            await User.findByIdAndUpdate(userId, { $push: 
                // { Pending: remaining, Collected: amount } }
            {
                Pending: {
                    date: currentDate,
                    amount: remaining
                },
                Collected: {
                    date: currentDate,
                    amount: amount
                }
            }
         } )
            res.status(200).json("Amount is pending")

        } else {
            await User.findByIdAndUpdate(userId, { $push: { Collected: amount } })
            res.status(200).json("Paid")

        }
    } catch {
        console.log(error)
        res.status(500).json(error)
    }

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



module.exports = { addUser, getUser, allUsers, deleteUser, updateUser, pay, collectionList }