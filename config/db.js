const mongoose = require("mongoose");

module.exports = async () => {
	const connectionParams = {
		dbName: "carbonCreditsMarketplace"
	};
	try {
		await mongoose.connect(process.env.DB, connectionParams);
		console.log("Connected to database successfully");
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
};