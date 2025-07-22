import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://task-1-leaderboard.onrender.com/api";

// Initial state
const initialState = {
	users: [],
	selectedUserId: "",
	newUserName: "",
	lastClaim: null,
	loading: false,
	error: null,
};

// Action types
const ACTION_TYPES = {
	SET_USERS: "SET_USERS",
	SET_SELECTED_USER: "SET_SELECTED_USER",
	SET_NEW_USER_NAME: "SET_NEW_USER_NAME",
	SET_LAST_CLAIM: "SET_LAST_CLAIM",
	SET_LOADING: "SET_LOADING",
	SET_ERROR: "SET_ERROR",
	CLEAR_ERROR: "CLEAR_ERROR",
};

// Reducer
const leaderboardReducer = (state, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_USERS:
			return {
				...state,
				users: action.payload,
				selectedUserId: state.selectedUserId || (action.payload.length > 0 ? action.payload[0]._id : ""),
			};
		case ACTION_TYPES.SET_SELECTED_USER:
			return { ...state, selectedUserId: action.payload };
		case ACTION_TYPES.SET_NEW_USER_NAME:
			return { ...state, newUserName: action.payload };
		case ACTION_TYPES.SET_LAST_CLAIM:
			return { ...state, lastClaim: action.payload };
		case ACTION_TYPES.SET_LOADING:
			return { ...state, loading: action.payload };
		case ACTION_TYPES.SET_ERROR:
			return { ...state, error: action.payload };
		case ACTION_TYPES.CLEAR_ERROR:
			return { ...state, error: null };
		default:
			return state;
	}
};

// Create context
const LeaderboardContext = createContext();

// Context provider component
export const LeaderboardProvider = ({ children }) => {
	const [state, dispatch] = useReducer(leaderboardReducer, initialState);

	// Action creators
	const actions = {
		setUsers: (users) => dispatch({ type: ACTION_TYPES.SET_USERS, payload: users }),
		setSelectedUser: (userId) => dispatch({ type: ACTION_TYPES.SET_SELECTED_USER, payload: userId }),
		setNewUserName: (name) => dispatch({ type: ACTION_TYPES.SET_NEW_USER_NAME, payload: name }),
		setLastClaim: (claim) => dispatch({ type: ACTION_TYPES.SET_LAST_CLAIM, payload: claim }),
		setLoading: (loading) => dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading }),
		setError: (error) => dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error }),
		clearError: () => dispatch({ type: ACTION_TYPES.CLEAR_ERROR }),
	};

	// API functions
	const fetchUsers = async () => {
		try {
			actions.setLoading(true);
			const response = await axios.get(`${API_BASE_URL}/users`);
			actions.setUsers(response.data);
		} catch (error) {
			actions.setError("Error fetching users");
			console.error("Error fetching users:", error);
		} finally {
			actions.setLoading(false);
		}
	};

	const addUser = async (name) => {
		if (!name.trim()) {
			actions.setError("Please enter a user name");
			return false;
		}

		try {
			actions.setLoading(true);
			await axios.post(`${API_BASE_URL}/users`, { name: name.trim() });
			actions.setNewUserName("");
			await fetchUsers();
			return true;
		} catch (error) {
			actions.setError(error.response?.data?.error || "Error adding user");
			return false;
		} finally {
			actions.setLoading(false);
		}
	};

	const claimPoints = async () => {
		if (!state.selectedUserId) {
			actions.setError("Please select a user");
			return false;
		}

		try {
			actions.setLoading(true);
			const response = await axios.post(`${API_BASE_URL}/claim-points`, {
				userId: state.selectedUserId,
			});

			actions.setLastClaim(response.data);
			await fetchUsers();
			return true;
		} catch (error) {
			actions.setError(error.response?.data?.error || "Error claiming points");
			return false;
		} finally {
			actions.setLoading(false);
		}
	};

	// Initialize users on mount
	useEffect(() => {
		fetchUsers();
	}, []);

	const contextValue = {
		...state,
		actions,
		fetchUsers,
		addUser,
		claimPoints,
	};

	return <LeaderboardContext.Provider value={contextValue}>{children}</LeaderboardContext.Provider>;
};

// Custom hook to use the context
export const useLeaderboard = () => {
	const context = useContext(LeaderboardContext);
	if (!context) {
		throw new Error("useLeaderboard must be used within a LeaderboardProvider");
	}
	return context;
};
