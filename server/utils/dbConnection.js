const mongoose = require("mongoose");

const DB_URL = process.env.MONGODB_URI;

mongoose
	.connect(DB_URL)
	.then(() => console.log("DB Connected"))
	.catch((err) => console.log("Error Connecting DB", err));


