const User = require('../Models/customerModel');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const date = require('date-and-time');

// Add customer

const addUser = async (req, res) => {
	console.log('qqqqqq');
	const {
		Name,
		MobileNo,
		Address,
		GivenAmount,
		TotalAmount,
		CollectionAmount,
		IdProof,
		Photo,
		InterestAmount,
		InterestPercentage,
		collectionDate,
		collectionPeriod,
		collectionEndDate
	} = req.body;
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
			TotalAmountCopy: TotalAmount,
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
		console.log(newUser, 'saved');
	} catch (error) {
		res.status(500).json(error);
	}
};

// customer details

const getUser = async (req, res) => {
	const id = req.params.id;

	try {
		const userDetails = await User.findById(id);
		if (userDetails) {
			res.status(200).json(userDetails);
		} else {
			res.status(404).json('No Details found');
		}
	} catch (error) {
		res.status(500).json(error);
	}
};

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
			console.log(id, 'uuuu');
			console.log('amount', TotalAmount);

			const updatedDatesForUser = [];
			const today = new Date();

			let mainAmount = TotalAmount;
			let reducing = mainAmount - CollectionAmount;
			mainAmount = reducing;
			console.log('mainAmount', mainAmount);

			for (
				let date = new Date(collectionDate);
				date <= new Date(collectionEndDate);
				date.setDate(date.getDate() + 1)
			) {
				if ((date - new Date(collectionDate)) % (7 * 24 * 60 * 60 * 1000) === 0) {
					const updatedDate = new Date(date);
					updatedDatesForUser.push(updatedDate);

					if (updatedDate.toDateString() === today.toDateString()) {
						console.log(updatedDatesForUser, 'upupup');
					}
				}
			}

			allWeeks.push({
				userId: id,
				dates: updatedDatesForUser
			});

			console.log('updated dates for user:', updatedDatesForUser);
		});

		// const todayDates = allWeeks.filter((user) => user.dates.some((date) => date.toDateString() === new Date().toDateString())).map((user) => user.userId);
		const todayUsers = allWeeks.filter((user) =>
			user.dates.some((date) => date.toDateString() === new Date().toDateString())
		);

		const todayDates = todayUsers.map((user) => ({
			date: user.dates.find((date) => date.toDateString() === new Date().toDateString()),
			userId: user.userId
		}));
		console.log('todayDates:', todayDates);

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
	const amount = req.body.CollectionAmount;

	try {
		const user = await User.findById(userId);
		const { CollectionAmount, Collected, TotalAmountCopy, TotalAmountHistory, TotalAmount } = user;

		const currentDate = new Date();

		let updatedTotalAmount = TotalAmountCopy - amount;

		// if (updatedTotalAmount < 0) {
		// 	updatedTotalAmount = 0;
		// }

		if (!TotalAmountHistory.includes(TotalAmount)) {
			TotalAmountHistory.push(TotalAmount);
		}


		if (updatedTotalAmount < 0) {
			console.log("zero", TotalAmountCopy);
			res.status(200).json('No action required');

		} else {
			TotalAmountHistory.push(updatedTotalAmount);



			if (amount < CollectionAmount) {
				const remaining = CollectionAmount - amount;

				console.log('updatedTotalAmount', updatedTotalAmount);
				console.log('TotalAmountHistory', TotalAmountHistory);

				// Update the user document
				await User.findByIdAndUpdate(userId, {
					$push: {
						Pending: {
							date: currentDate,
							amount: remaining
						},
						Collected: {
							date: currentDate,
							amount: amount
						}
					},
					TotalAmountCopy: updatedTotalAmount,
					TotalAmountHistory: TotalAmountHistory
				});




				res.status(200).json('Amount is pending');
			} else {
				console.log('updatedTotalAmount', updatedTotalAmount);
				console.log('TotalAmountHistory', TotalAmountHistory);

				// Update the user document
				await User.findByIdAndUpdate(userId, {
					$push: {
						Collected: {
							date: currentDate,
							amount: amount
						}
					},
					TotalAmountCopy: updatedTotalAmount,
					TotalAmountHistory: TotalAmountHistory
				});

				res.status(200).json('Paid');
			}
		}
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};


// delete customer

const deleteUser = async (req, res) => {
	const id = req.params.id;
	try {
		await User.findByIdAndDelete(id);
		res.status(200).json('customer deleted');
	} catch (error) {
		res.status(500).json(error);
	}
};

//update customer

const updateUser = async (req, res) => {
	const id = req.params.id;
	try {
		const user = await User.findByIdAndUpdate(id, req.body, { new: true });
		res.status(200).json({ user });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

// pay

module.exports = { addUser, getUser, allUsers, deleteUser, updateUser, pay, collectionList };
