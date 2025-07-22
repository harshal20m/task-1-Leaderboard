import React from "react";
import { useLeaderboard } from "../context/LeaderboardContext";
import LoadingSpinner from "./LoadingSpinner";

const UserSelection = () => {
	const { users, selectedUserId, lastClaim, loading, error, actions, claimPoints } = useLeaderboard();

	const handleClaimPoints = async () => {
		const success = await claimPoints();
		if (success) {
			actions.clearError();
		}
	};

	return (
		<div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm p-4 mb-6">
			<div className="text-center mb-4">
				<h3 className="text-lg font-semibold text-gray-800">🎯 Claim Points</h3>
				<p className="text-sm text-gray-600 mt-1">Select a user and claim random points (1-10)</p>
			</div>

			<div className="mb-4">
				<label className="block text-base font-semibold text-gray-700 mb-2">Select User:</label>
				<select
					value={selectedUserId}
					onChange={(e) => actions.setSelectedUser(e.target.value)}
					className="w-full p-3 border-2 border-gray-300 rounded-xl text-base bg-white focus:border-gray-500 focus:outline-none transition-colors duration-300"
				>
					<option value="">Choose a user...</option>
					{users.map((user) => (
						<option key={user._id} value={user._id}>
							{user.name} ({user.totalPoints} pts)
						</option>
					))}
				</select>
			</div>

			{error && (
				<div className="mb-3 p-3 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg text-sm">
					{error}
				</div>
			)}

			<button
				onClick={handleClaimPoints}
				disabled={!selectedUserId || loading}
				className="w-full py-3 px-4 bg-gray-800 text-white font-bold text-lg rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm active:scale-95"
			>
				{loading ? (
					<div className="flex items-center justify-center">
						<LoadingSpinner />
						<span className="ml-2">Claiming...</span>
					</div>
				) : (
					"🎲 Claim Random Points"
				)}
			</button>

			{/* Last Claim Display */}
			{lastClaim && (
				<div className="mt-4 p-3 bg-green-50 border-2 border-green-200 rounded-xl animate-bounce-slow">
					<p className="text-center text-sm">
						🎉 <span className="font-bold text-green-700">{lastClaim.userName}</span> earned{" "}
						<span className="font-bold text-gray-800 text-lg">{lastClaim.pointsAwarded} points</span>!
						<br />
						<span className="text-gray-600">New total: </span>
						<span className="font-bold text-gray-800">{lastClaim.newTotal} points</span>
					</p>
				</div>
			)}
		</div>
	);
};

export default UserSelection;
