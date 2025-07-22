import React, { useState } from "react";
import { LeaderboardProvider } from "../context/LeaderboardContext";
import Header from "../components/Header";
import UserSelection from "../components/UserSelection";
import AddUser from "../components/AddUser";
import Leaderboard from "../components/Leaderboard";

const Home = () => {
	const [activeTab, setActiveTab] = useState("users");

	const TabButton = ({ label, icon, isActive, onClick }) => (
		<button
			onClick={onClick}
			className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
				isActive
					? "bg-white text-gray-800 shadow-lg border-2 border-gray-300"
					: "bg-gray-100 text-gray-600 border-2 border-gray-200"
			}`}
		>
			<div className="flex items-center justify-center space-x-2">
				<span className="text-lg">{icon}</span>
				<span>{label}</span>
			</div>
		</button>
	);

	return (
		<LeaderboardProvider>
			<div className="min-h-screen bg-gray-50 font-sans">
				<Header />

				{/* Tab Navigation */}
				<div className="sticky top-0 z-10 bg-white border-b-2 border-gray-200 shadow-sm">
					<div className="px-4 py-3">
						<div className="flex space-x-2 max-w-md mx-auto">
							<TabButton
								tab="users"
								label="Users"
								icon="👥"
								isActive={activeTab === "users"}
								onClick={() => setActiveTab("users")}
							/>
							<TabButton
								tab="leaderboard"
								label="Leaderboard"
								icon="🏅"
								isActive={activeTab === "leaderboard"}
								onClick={() => setActiveTab("leaderboard")}
							/>
						</div>
					</div>
				</div>

				{/* Content Area */}
				<main className="px-4 py-6 max-w-md mx-auto">
					{activeTab === "users" && (
						<div className="animate-fade-in">
							<div className="mb-4">
								<h2 className="text-xl font-bold text-gray-800 text-center mb-4">👥 Manage Users</h2>
							</div>
							<UserSelection />
							<AddUser />
						</div>
					)}

					{activeTab === "leaderboard" && (
						<div className="animate-fade-in">
							<div className="mb-4">
								<h2 className="text-xl font-bold text-gray-800 text-center mb-4">🏆 Rankings</h2>
							</div>
							<Leaderboard />
						</div>
					)}
				</main>
			</div>
		</LeaderboardProvider>
	);
};

export default Home;
