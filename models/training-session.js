const mongoose = require("mongoose");

const cardDetailsSchema = new mongoose.Schema(
	{
    	number: {
			type: String,
			trim: true,
			required: [true, "Card number is required"],
			set: function(number) {
				return (number.slice(-4));
			},
			match: [/^\d{4}$/, "Invalid masked credit card number format"]
		},
		expiryDate: {
			type: String,
			trim: true,
			required: [true, "Card expiry date is required"],
			match: [/^(0[1-9]|1[0-2])(\/)(\d{4})$/, "Invalid expiry date format"],
			validate: {
				validator: function (expiryDate) {
					let [month, year] = expiryDate.split("/");
					let parsedExpiryDate = new Date(parseInt(year), parseInt(month) - 1, 1).setHours(0, 0, 0, 0);

					let currentDate = new Date().setHours(0, 0, 0, 0);

					return (currentDate < parsedExpiryDate)
				},
				message: "Card has expired"
			}
		}
	},
	{
		_id: false,
	}
);

const trainingSessionSchema = new mongoose.Schema(
	{
		personId: {
			type: String,
			required: [true, "Person identifier is required"],
			unique: [true, "Person identifier already exists"],
			match: [/^[0-9a-z]{10}$/, "Invalid person id format"]
		},
		name: {
			type: String,
			required: [true, "Name is required"],
			index: true,
			trim: true,
			match: [/^[a-zA-Z\s]{2,25}$/, "Name can only contain (latin) letters, and spaces"]
		},
		date: {
			type: Date,
			required: [true, "Training date is required"],
			index: true,
			set: function (date) {
				if (!date) return;
				
				let [day, month, year] = date.split("/");
				return (new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).setHours(0, 0, 0, 0));
			},
			validate: {
				validator: function (date) {
					return (date.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0));
				},
				message: "Training date must be today or in the future"
			}
		},
		card: {
			type: cardDetailsSchema,
			required: [true, "Card details are required"]
		},
	},
	{
		timestamps: true,
	}
);

const trainingSessionModel = mongoose.model(
	"TrainingSession",
	trainingSessionSchema
);
module.exports = trainingSessionModel;
