import './Profile.css';

import jwtDecode from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import Blockies from 'react-blockies';

import { Auth } from '../types';

interface Props {
    auth: Auth;
    onLoggedOut: () => void;
}

interface State {
    loading: boolean;
    user?: {
        id: number;
        username: string;
    };
    username: string;
}

interface JwtDecoded {
    payload: {
        id: string;
        publicAddress: string;
    };
}

export const Profile = ({ auth, onLoggedOut }: Props): JSX.Element => {
    const [state, setState] = useState<State>({
        loading: false,
        user: undefined,
        username: '',
    });

    // Hard-coded dashboard data
    const dashboardData = {
        deposit: 1000,  // You can adjust these values
        earnings: 150,
    };

	useEffect(() => {
		const { accessToken } = auth;
		const {
			payload: { id },
		} = jwtDecode<JwtDecoded>(accessToken);

		fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((response) => response.json())
			.then((user) => setState((state) => ({ ...state, user })))
			.catch(window.alert);
	}, [auth]);

	const handleChange = ({
		target: { value },
	}: React.ChangeEvent<HTMLInputElement>) => {
		setState({ ...state, username: value });
	};

	const handleSubmit = () => {
		const { accessToken } = auth;
		const { user, username } = state;

		setState({ ...state, loading: true });

		if (!user) {
			window.alert(
				'The user id has not been fetched yet. Please try again in 5 seconds.'
			);
			return;
		}

		fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${user.id}`, {
			body: JSON.stringify({ username }),
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			method: 'PATCH',
		})
			.then((response) => response.json())
			.then((user) => setState({ ...state, loading: false, user }))
			.catch((err) => {
				window.alert(err);
				setState({ ...state, loading: false });
			});
	};
    const { accessToken } = auth;
    const {
        payload: { publicAddress },
    } = jwtDecode<JwtDecoded>(accessToken);

    const { loading, user } = state;
    const username = user && user.username;

    return (
        <div className="Profile">
			<div className="bg"></div>
<div className="bg bg2"></div>
<div className="bg bg3"></div>
            {/* Dashboard Content with Hard-coded Data */}
<div className='title' >A.I DASHBOARD
</div>
            <div className="dashboard">
			<pre className="dashboarda" >{publicAddress}</pre>
			<div className="parameter">
                    <label>Username</label>
                    <span className="huhu">{username ? <pre>{username}</pre> : ''}{' '}</span>
                </div>
                <div className="parameter">
                    <label>Deposit:</label>
                    <span>${dashboardData.deposit}</span>
                </div>
                <div className="parameter">
                    <label>Earnings:</label>
                    <span>${dashboardData.earnings}</span>
                </div>
            </div>
			<div className="actions">
                                <button className="action-button">Emergency Withdraw</button>
                                <button className="action-button">Deposit Crypto</button>
                                <button className="action-button">Withdraw Earnings</button>
                            </div>
            {/* Original Profile Content */}
           
            <div className="guda">
                <label htmlFor="username">Change username: </label>
                <input name="username" onChange={handleChange} />
                <button disabled={loading} onClick={handleSubmit}>
                    Submit
                </button>
            </div>
            <p>
                <button className="makwekwe action-button" onClick={onLoggedOut}>Logout</button>
            </p>
        </div>
    );
};