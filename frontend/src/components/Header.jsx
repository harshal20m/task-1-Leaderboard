import React from "react";

const Header = () => {
	return (
		<header className="bg-white border-b-2 border-gray-200 shadow-sm">
			<div className="px-4 py-4">
				<h1 className="text-2xl font-bold text-gray-800 text-center">🏆 Leaderboard App</h1>
				<p className="text-gray-600 text-center text-sm mt-1">Manage users and track rankings</p>
			</div>
		</header>
	);
};

export default Header;
