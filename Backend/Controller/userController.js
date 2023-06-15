const User = require('../Models/customerModel');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const date = require('date-and-time');

// Add customer

const addUser = async (req, res) => {
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
			collectionEndDate,

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
			const { collectionDate, collectionEndDate, id, TotalAmount, CollectionAmount, Name, Address, MobileNo } = user;

			const updatedDatesForUser = [];
			const today = new Date();

			for (
				let date = new Date(collectionDate);
				date <= new Date(collectionEndDate);
				date.setDate(date.getDate() + 1)
			) {
				if ((date - new Date(collectionDate)) % (7 * 24 * 60 * 60 * 1000) === 0) {
					const updatedDate = new Date(date);
					updatedDatesForUser.push(updatedDate);

					if (updatedDate.toDateString() === today.toDateString()) {
					}
				}
			}

			allWeeks.push({
				userId: id,
				dates: updatedDatesForUser,
				Name: Name,
				CollectionAmount: CollectionAmount,
				Address: Address,
				MobileNo: MobileNo

			});

		});

		const todayUsers = allWeeks.filter((user) =>
			user.dates.some((date) => date.toDateString() === new Date().toDateString())
		);

		const todayDates = todayUsers.map((user) => ({
			date: user.dates.find(
				(date) => date.toDateString() === new Date().toDateString()
			),
			userId: user.userId,
			Name: user.Name,
			CollectionAmount: user.CollectionAmount,
			Address: user.Address,
			MobileNo: user.MobileNo,
		}));


		// for (const dateObj of todayDates) {
		// 	const { date, userId } = dateObj;
		// 	// Fetch CollectionAmount from the database
		// 	const user = await User.findById(userId);
		// 	const CollectionAmount = user.CollectionAmount;

		// 	const updateQuery = {
		// 		$push: {
		// 			'Pending': {
		// 				date: date,
		// 				amount: CollectionAmount,
		// 				state: 'Pending'
		// 			}
		// 		}
		// 	};

		// 	if (!user.Pending.some((item) => item.date.toDateString() === date.toDateString())) {
		// 		// Update the document with the new entry
		// 		await User.updateOne({ _id: userId }, updateQuery);
		// 	}



		// }
		let updatePerformed = false; // Flag to track if the update has been performed

		for (const dateObj of todayDates) {
			const { date, userId } = dateObj;

			const user = await User.findById(userId);
			const CollectionAmount = user.CollectionAmount;

			const isAlreadyPending = user.Pending.some(
				(item) => item.date.toDateString() === date.toDateString()
			);

			if (!isAlreadyPending && !updatePerformed) {
				const updateQuery = {
					$push: {
						Pending: {
							date: date,
							amount: CollectionAmount,
							state: 'Pending',
						},
					},
				};

				await User.updateOne({ _id: userId }, updateQuery);
				updatePerformed = true; // Set the flag to true after the update
			}
		}

		const filteredTodayDates = todayDates.filter((dateObj) => {
			const { userId } = dateObj;

			// Check if user.Pending is "Pending"
			const user = users.find((user) => user.id === userId);
			const isPending = user.Pending.some((item) => item.state === 'Pending');

			return isPending;
		});

		res.status(201).json({
			allWeeks: allWeeks,
			todayDates: filteredTodayDates
		});
	} catch (error) {
		console.log(error);
	}
};




// pay


// const pay = async (req, res) => {
// 	const userId = req.params.id;
// 	const amount = req.body.CollectionAmount;

// 	try {
// 		const user = await User.findById(userId);
// 		const {
// 			CollectionAmount,
// 			Collected,
// 			Pending,
// 			TotalAmountCopy,
// 			TotalAmountHistory,
// 			TotalAmount,
// 		} = user;

// 		const currentDate = new Date();

// 		let updatedTotalAmount = TotalAmountCopy - amount;

// 		console.log("TotalAmountCopy", TotalAmountCopy);

// 		if (!TotalAmountHistory.includes(TotalAmount)) {
// 			TotalAmountHistory.push(TotalAmount);
// 			console.log("bh");
// 		}

// 		if (updatedTotalAmount < 0) {
// 			res
// 				.status(401)
// 				.json({ "money morethan remaing amount": TotalAmountCopy });

// 			console.log("no moneyyy bhaiiii");
// 		} else {
// 			TotalAmountHistory.push(updatedTotalAmount);




// 			if (amount < CollectionAmount) {
// 				const remaining = CollectionAmount - amount;

// 				// Update the user document
// 				const pendingEntry = await user.Pending.find(
// 					(item) => item.date.toDateString() === currentDate.toDateString()
// 				);


// 				if (!pendingEntry) {
// 					// Add a new entry for the current date
// 					user.Pending.push({ date: currentDate, amount: remaining, userId });
// 				} else {
// 					// Update the existing entry for the current date
// 					pendingEntry.amount = remaining;
// 				}

// 				// await User.findByIdAndUpdate(userId, {
// 				//   $push: {
// 				//     // Pending: {
// 				//     //   date: currentDate,
// 				//     //   amount: remaining,
// 				//     //   userId: userId,
// 				//     // },
// 				//     Collected: {
// 				//       date: currentDate,
// 				//       amount: amount,
// 				//       userId: userId,
// 				//     },
// 				//   },
// 				//   TotalAmountCopy: updatedTotalAmount,
// 				//   TotalAmountHistory: TotalAmountHistory,
// 				// });
// 				await user.Collected.push({ date: currentDate, amount, userId,state:"Pending" });
// 				user.TotalAmountCopy = updatedTotalAmount;
// 				user.save();


// 				res.status(200).json("Amount is pending");
// 				console.log("updatedTotalAmount", updatedTotalAmount);
// 				console.log("TotalAmountHistory", TotalAmountHistory);
// 				console.log("pedning amount updated", Pending);
// 				console.log("collected amount updated", Collected);
// 			} else {
// 				// Update the user document
// 				await User.findByIdAndUpdate(userId, {
// 					$push: {
// 						Collected: {
// 							date: currentDate,
// 							amount: amount,
// 							userId: userId,
// 							state:"Collected",
// 						},
// 					},
// 					TotalAmountCopy: updatedTotalAmount,
// 					TotalAmountHistory: TotalAmountHistory,
// 				});

// 				res.status(200).json("Paid");

// 				console.log("updatedTotalAmount", updatedTotalAmount);
// 				console.log("TotalAmountHistory", TotalAmountHistory);
// 			}
// 		}
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json(error);
// 	}
// };
// const pay = async (req, res) => {
// 	// const userId = req.params.id;
// 	// const amount = req.body.CollectionAmount;

// 	const { userId, amount } = req.body

// 	try {
// 		const user = await User.findById(userId);
// 		const {
// 			CollectionAmount,
// 			Collected,
// 			Pending,
// 			TotalAmountCopy,
// 			TotalAmountHistory,
// 			TotalAmount,
// 			InterestPercentage
// 		} = user;
// 		const currentDate = new Date();

// 		let updatedTotalAmount = TotalAmountCopy - amount;

// 		console.log("TotalAmountCopy", TotalAmountCopy);

// 		if (!TotalAmountHistory.includes(TotalAmount)) {
// 			TotalAmountHistory.push(TotalAmount);
// 			console.log("bh");
// 		}

// 		if (updatedTotalAmount < 0) {
// 			res.status(401).json({ "money more than remaining amount": TotalAmountCopy });

// 			console.log("no moneyyy bhaiiii");
// 		} else {
// 			TotalAmountHistory.push(updatedTotalAmount);

// 			if (amount < CollectionAmount) {
// 				const remaining = CollectionAmount - amount;
//              console.log('ree',remaining);
// 				// Update the user document
// 				const pendingEntry = await user.Pending.find(
// 					(item) => item.date.toDateString() === currentDate.toDateString()
// 				);

// 				if (!pendingEntry) {
// 					// Add a new entry for the current date
// 					user.Pending.push({ date: currentDate, amount: remaining, userId, state: "pending" });
// 				} else {
// 					// Update the existing entry for the current date
// 					pendingEntry.amount = remaining;
					
// 				}
// 				await user.Collected.push({ date: currentDate, amount, userId, state: "Collected" });
// 				const profit = amount * user.InterestPercentage / 100
// 				console.log("ggggggggggg", user.CollectionAmount, user.InterestPercentage);
// 				console.log(profit, 'profit');
// 				console.log(userId);
// 				await User.findByIdAndUpdate(userId, {
// 					$push: {
						
// 						TodayProfit: {
// 							date: currentDate,
// 							Profit: profit
// 						}
// 					}
// 				})
				
// 				user.TotalAmountCopy = updatedTotalAmount;
// 				const totalPendingAmount = user.Pending.reduce((sum, item) => {
// 					if (item.state === "pending") {
// 						return sum + item.amount;
// 					}
// 					return sum;
// 				}, 0);

// 				user.TotalCollected = TotalAmount - TotalAmountCopy - totalPendingAmount;


// 				// Calculate the total sum of pending amounts with status "pending"
// 				// const totalPendingAmount = user.Pending.reduce((sum, item) => {
// 				// 	console.log("item",item);
// 				// 	if (item.state === "Pending") {
// 				// 		console.log("pending", item.amount);
// 				// 		return sum + item.amount;
// 				// 	}
// 				// 	return sum;
// 				// }, 0);

// 				// console.log("Total pending amount:", totalPendingAmount);
// 				// user.totalPendingAmount = totalPendingAmount;

// 				await user.save();

// 				res.status(200).json("Amount is pending");
// 			} else {
// 				const profit = amount * user.InterestPercentage / 100
// 				console.log("ggggggggggg", user.CollectionAmount, user.InterestPercentage);
// 				console.log(profit,'profit');

// 				await User.findByIdAndUpdate(userId, {
// 					$push: {
// 						Collected: {
// 							date: currentDate,
// 							amount: amount,
// 							userId: userId,
// 							state: "Collected",
// 						},
// 						TodayProfit: {
// 							date: currentDate,
// 							Profit: profit
// 						}
// 					},
// 					TotalAmountCopy: updatedTotalAmount,
// 					TotalAmountHistory: TotalAmountHistory,
// 				});

				
// 				// user.Pending.state = "Collected"
// 				// await user.save()
// 				// for (const pendingEntry of user.Pending) {
// 				// 	if (pendingEntry.date.toDateString() === currentDate.toDateString()) {
// 				// 		pendingEntry.state = "Collected";
// 				// 	}

// 				// }
// 				// const pendingEntryIndex = user.Pending.findIndex(item => item.date.toDateString() === currentDate.toDateString());

// 				// if (pendingEntryIndex !== -1) {
// 				// 	user.Pending.splice(pendingEntryIndex, 1);
// 				// 	await user.save();
// 				// }



// 				user.TotalCollected = user.TotalAmount - user.TotalAmountCopy
// 				user.save()
// 				res.status(200).json("Paid");

// 				console.log("updatedTotalAmount", updatedTotalAmount);
// 				console.log("TotalAmountHistory", TotalAmountHistory);
// 			}
// 		}

// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json(error);
// 	}
// };

//pending                                     
// const pendingList = async (req, res) => {
// 	try {
// 		const users = await User.find();

// 		const pendingUsers = users.filter(user => {
// 			const pending = user.Pending[0]; // Access the first element of the array
// 			return (
// 				pending &&
// 				pending.state === "Pending" &&
// 				pending.amount > 0
// 			);
// 		});

// 		res.status(200).json({ users: pendingUsers });
// 	} catch (error) {
// 		res.status(500).json({ error: 'Internal server error' });
// 	}
// };


const pay = async (req, res) => {
	const { userId, amount } = req.body;

	try {
		const user = await User.findById(userId);
		const {
			CollectionAmount,
			Collected,
			Pending,
			TotalAmountCopy,
			TotalAmountHistory,
			TotalAmount,
			InterestPercentage
		} = user;
		const currentDate = new Date();

		let updatedTotalAmount = TotalAmountCopy - amount;

		console.log("TotalAmountCopy", TotalAmountCopy);

		if (!TotalAmountHistory.includes(TotalAmount)) {
			TotalAmountHistory.push(TotalAmount);
			console.log("bh");
		}

		if (updatedTotalAmount < 0) {
			res.status(401).json({ "money more than remaining amount": TotalAmountCopy });
			console.log("no moneyyy bhaiiii");
		} else {
			TotalAmountHistory.push(updatedTotalAmount);

			if (amount < CollectionAmount) {
				const remaining = CollectionAmount - amount;

				// Update the user document
				const pendingEntry = await user.Pending.find(
					(item) => item.date.toDateString() === currentDate.toDateString()
				);

				if (!pendingEntry) {
					// Add a new entry for the current date
					user.Pending.push({ date: currentDate, amount: remaining, userId, state: "Pending" });
				} else {
					// Update the existing entry for the current date
					pendingEntry.amount = remaining;
				}

				await user.Collected.push({ date: currentDate, amount, userId, state: "Collected" });
				const profit = amount * (InterestPercentage / 100);
				
				await User.findByIdAndUpdate(userId, {
					$push: {
						TodayProfit: {
							date: currentDate,
							Profit: profit
						}
					}
				});

				user.TotalAmountCopy = updatedTotalAmount;

				

				user.TotalCollected = TotalAmount - updatedTotalAmount 
				console.log(user.TotalCollected,"user.TotalCollectedifffffffffffffffffffffff");

				res.status(200).json("Amount is pending");
			} else {
				const profit = amount * (InterestPercentage / 100);
				console.log("ggggggggggg", CollectionAmount, InterestPercentage);
				console.log(profit, "profit");

				await User.findByIdAndUpdate(userId, {
					$push: {
						Collected: {
							date: currentDate,
							amount: amount,
							userId: userId,
							state: "Collected"
						},
						TodayProfit: {
							date: currentDate,
							Profit: profit
						}
					},
					TotalAmountCopy: updatedTotalAmount,
					TotalAmountHistory: TotalAmountHistory
				});


				user.Pending.state = "Collected"
				await user.save()
				for (const pendingEntry of user.Pending) {
					if (pendingEntry.date.toDateString() === currentDate.toDateString()) {
						pendingEntry.state = "Collected";
					}

				}
				const pendingEntryIndex = user.Pending.findIndex(item => item.date.toDateString() === currentDate.toDateString());

				if (pendingEntryIndex !== -1) {
					user.Pending.splice(pendingEntryIndex, 1);
					await user.save();
				}

				user.TotalAmountCopy = updatedTotalAmount;
				user.TotalCollected = TotalAmount - updatedTotalAmount;
				console.log(user.TotalCollected,"user.TotalCollected elseeeeeeeee");
				await user.save();

				res.status(200).json("Paid");

				console.log("updatedTotalAmount", updatedTotalAmount);
				console.log("TotalAmountHistory", TotalAmountHistory);
			}

			// Calculate the total profit

			user.TotalProfit=user.TotalCollected*user.InterestPercentage/100
			console.log(user.TotalProfit,"user.TodayProfit");
			// const totalProfit = user.TodayProfit.reduce((sum, item) => {
			// 	const tdyprofit = parseFloat(item.Profit)
			// 	return sum + tdyprofit;
			// }, 0);
			// console.log("Total Profit:", totalProfit);

			// // Update the total profit in the user document
			// user.TotalProfit = totalProfit;
			await user.save();
		}
		
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};


// transaction pay

const transactionpay = async (req, res) => {
	const amount = req.body
	const userId = req.params.id

	try {
		const user = await User.findById(userId);
		const { totalPendingAmount } = user

		if (amount <= totalPendingAmount) {

			totalPendingAmount = totalPendingAmount - amount


		}


	} catch (error) {

	}


}


// user details

const userDetails = async (req, res) => {
	const userId = req.params.id
	const currentDate = new Date()

	try {
		const user = await User.find(userId)

		//total collected

		// let totalCollected = 0;
		// for (const Collected of user.Collected) {
		// 	totalCollected += parseFloat(Collected.amount);
		// }


		//total pending

		for (const Pending of user.Pending) {
			user.TotalPending += parseFloat(Pending.amount);
		}






		res.status(200).json({
			totalProfit,
			totalCollected,
			totalPending,
			remainingAmount
		});
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
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

module.exports = { addUser, getUser, allUsers, deleteUser, updateUser, pay, collectionList, transactionpay, userDetails };
