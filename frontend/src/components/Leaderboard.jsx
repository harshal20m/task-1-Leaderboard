import React from "react";
import { useLeaderboard } from "../context/LeaderboardContext";

const Leaderboard = () => {
	const { users, loading } = useLeaderboard();

	// Split users into top 3 and rest
	const topThreeUsers = users.slice(0, 3);
	const remainingUsers = users.slice(3);

	const firstPlace = topThreeUsers.find((user) => user.rank === 1);
	const secondPlace = topThreeUsers.find((user) => user.rank === 2);
	const thirdPlace = topThreeUsers.find((user) => user.rank === 3);

	const PodiumStep = ({ user, height, bgColor, textColor, medal, position }) => {
		if (!user) {
			return (
				<div className="flex-1 flex flex-col items-center">
					<div className="mb-2 text-2xl opacity-30">👤</div>
					<div
						className={`w-full ${bgColor} border-2 border-gray-300 rounded-t-lg flex flex-col items-center justify-center ${height}`}
					>
						<span className="text-xs text-gray-400">Empty</span>
					</div>
				</div>
			);
		}

		return (
			<div className="flex-1 flex flex-col items-center">
				{/* Medal */}
				<div className="mb-2 text-2xl animate-pulse">{medal}</div>

				{/* User Info */}
				<div className="text-center mb-2">
					<div className="text-sm font-bold text-gray-800">{user.name}</div>
					<div className={`text-xs font-semibold ${textColor}`}>{user.totalPoints} pts</div>
				</div>

				{/* Podium Step */}
				<div
					className={`w-full ${bgColor} border-2 ${
						position === 1 ? "border-yellow-400" : position === 2 ? "border-gray-400" : "border-yellow-600"
					} rounded-t-lg flex flex-col items-center justify-center ${height} relative`}
				>
					<div className="text-xl font-bold text-gray-700">#{user.rank}</div>
					<div className="text-xs text-gray-600 mt-1">
						{position === 1 ? "1st" : position === 2 ? "2nd" : "3rd"}
					</div>
				</div>
			</div>
		);
	};

	if (loading && users.length === 0) {
		return (
			<div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm p-4">
				<div className="text-center mb-4">
					<h3 className="text-lg font-semibold text-gray-800">📊 Current Rankings</h3>
				</div>
				<div className="text-center py-8">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-600 mx-auto mb-4"></div>
					<p className="text-lg text-gray-500">Loading rankings...</p>
				</div>
			</div>
		);
	}

	if (users.length === 0) {
		return (
			<div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm p-4">
				<div className="text-center py-8">
					<div className="text-4xl mb-3">🤷‍♂️</div>
					<p className="text-lg text-gray-500">No users found</p>
					<p className="text-sm text-gray-400 mt-2">Add users in the Users tab</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm p-4">
			{/* Staircase/Podium Section - Top 3 Users */}
			<div className="mb-6">
				{/* Podium Steps */}
				<div className="flex items-end justify-center gap-2 mb-4">
					{/* 2nd Place */}
					<PodiumStep
						user={secondPlace}
						height="h-16"
						bgColor="bg-gray-100"
						textColor="text-gray-600"
						medal="🥈"
						position={2}
					/>

					{/* 1st Place (Highest) */}
					<PodiumStep
						user={firstPlace}
						height="h-20"
						bgColor="bg-yellow-100"
						textColor="text-yellow-700"
						medal="🥇"
						position={1}
					/>

					{/* 3rd Place */}
					<PodiumStep
						user={thirdPlace}
						height="h-12"
						bgColor="bg-yellow-50"
						textColor="text-yellow-600"
						medal="🥉"
						position={3}
					/>
				</div>

				{/* Podium Base */}
				<div className="w-full h-2 bg-gray-300 rounded-b-lg"></div>
			</div>

			{/* Remaining Users List - 4th place and below */}
			{remainingUsers.length > 0 && (
				<div>
					<div className="space-y-3">
						{remainingUsers.map((user) => (
							<div
								key={user._id}
								className="flex items-center p-3 rounded-xl bg-gray-50 border-2 border-gray-200 transition-all duration-300 transform active:scale-98"
							>
								{/* Rank */}
								<div className="text-xl font-bold text-gray-500 min-w-10">#{user.rank}</div>

								{/* User Info */}
								<div className="flex-1 mx-3">
									<div className="flex flex-col">
										<span className="text-base font-semibold text-gray-700">{user.name}</span>
										<span className="text-sm font-bold text-gray-600">
											{user.totalPoints} points
										</span>
									</div>
								</div>

								{/* Position indicator */}
								<div className="text-lg">
									{user.rank === 4 && <span>🎖️</span>}
									{user.rank === 5 && <span>🏅</span>}
									{user.rank === 6 && <span>⭐</span>}
									{user.rank > 6 && <span>🔹</span>}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Summary Footer */}
			{users.length > 0 && (
				<div className="mt-6 pt-4 border-t border-gray-200 text-center">
					<div className="flex justify-around text-xs text-gray-500">
						<span>Total Users: {users.length}</span>
						<span>•</span>
						<span>Last Updated: {new Date().toLocaleTimeString()}</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default Leaderboard;
