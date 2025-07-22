const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const User = require("./models/User");
const History = require("./models/History");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/leaderboard", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Initialize default users
const initializeUsers = async () => {
	try {
		const count = await User.countDocuments();
		if (count === 0) {
			const defaultUsers = [
				"Rahul",
				"Kamal",
				"Sanak",
				"Priya",
				"Amit",
				"Neha",
				"Vikram",
				"Pooja",
				"Ravi",
				"Sneha",
			];

			for (const name of defaultUsers) {
				await User.create({ name, totalPoints: 0 });
			}
			console.log("Default users initialized");
		}
	} catch (error) {
		console.error("Error initializing users:", error);
	}
};

// Routes

// Get all users with rankings
app.get("/api/users", async (req, res) => {
	try {
		const users = await User.find().sort({ totalPoints: -1 });

		// Add rank to each user
		const usersWithRank = users.map((user, index) => ({
			...user.toObject(),
			rank: index + 1,
		}));

		res.json(usersWithRank);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Add new user
app.post("/api/users", async (req, res) => {
	try {
		const { name } = req.body;

		if (!name) {
			return res.status(400).json({ error: "Name is required" });
		}

		const newUser = new User({ name, totalPoints: 0 });
		await newUser.save();

		res.status(201).json(newUser);
	} catch (error) {
		if (error.code === 11000) {
			return res.status(400).json({ error: "User already exists" });
		}
		res.status(500).json({ error: error.message });
	}
});

// Claim points for a user
app.post("/api/claim-points", async (req, res) => {
	try {
		const { userId } = req.body;

		if (!userId) {
			return res.status(400).json({ error: "User ID is required" });
		}

		// Find user
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Generate random points (1-10)
		const pointsAwarded = Math.floor(Math.random() * 10) + 1;

		// Update user's total points
		user.totalPoints += pointsAwarded;
		await user.save();

		// Create history record
		const history = new History({
			userId: user._id,
			userName: user.name,
			pointsAwarded,
		});
		await history.save();

		res.json({
			message: "Points claimed successfully",
			pointsAwarded,
			newTotal: user.totalPoints,
			userName: user.name,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get claim history
app.get("/api/history", async (req, res) => {
	try {
		const history = await History.find().sort({ claimedAt: -1 }).limit(50); // Limit to last 50 records

		res.json(history);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Start server
mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB");
	initializeUsers();

	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});
