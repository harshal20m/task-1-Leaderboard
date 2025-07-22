import React from "react";
import { useLeaderboard } from "../context/LeaderboardContext";

const AddUser = () => {
	const { newUserName, loading, error, actions, addUser } = useLeaderboard();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const success = await addUser(newUserName);
		if (success) {
			alert("User added successfully!");
			actions.clearError();
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
			<h3 className="text-xl font-bold text-gray-800 mb-3 text-center">➕ Add New User</h3>

			{error && error.includes("user") && (
				<div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">{error}</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-3">
				<input
					type="text"
					placeholder="Enter user name"
					value={newUserName}
					onChange={(e) => actions.setNewUserName(e.target.value)}
					className="w-full p-3 border-2 border-gray-200 rounded-xl text-base focus:border-green-500 focus:outline-none transition-colors duration-300"
					disabled={loading}
				/>
				<button
					type="submit"
					disabled={loading || !newUserName.trim()}
					className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
				>
					{loading ? "Adding..." : "Add User"}
				</button>
			</form>
		</div>
	);
};

export default AddUser;
