import './App.css';
import queryString from 'query-string';
import { useEffect, useState } from 'react';

type AppProps = {
	redirected: boolean;
};

const App = ({ redirected }: AppProps) => {
	const { code } = queryString.parse(window.location.search);
	console.log(code);

	const [attemptedAuth, setAttemptedAuth] = useState(false);

	const clientId = import.meta.env.VITE_CLIENT_ID;
	const responseType = 'code';
	const redirectURI = 'http://localhost:5173/exchange_token';
	const approvalPrompt = 'force';
	const scope = 'read_all';

	const stravaOAuth = queryString.stringifyUrl(
		{
			url: 'https://www.strava.com/oauth/authorize',
			query: {
				client_id: clientId,
				response_type: responseType,
				redirect_uri: redirectURI,
				approval_prompt: approvalPrompt,
				scope,
			},
		},
		{ encode: false, sort: false }
	);

	useEffect(() => {
		if (!Boolean(code) || code === undefined) {
			return;
		}

		const exchangeToken = async (token: any) => {
			const exchangeUrl = queryString.stringifyUrl({
				url: 'https://www.strava.com/oauth/token',
				query: {
					client_id: clientId,
					client_secret: import.meta.env.VITE_CLIENT_SECRET,
					code: token,
					grant_type: 'authorization_code',
				},
			});

			const res = await fetch(exchangeUrl, { method: 'POST' });
			setAttemptedAuth(true);
			console.log(res);
		};

		if (!attemptedAuth) {
			exchangeToken(code);
		}
	});

	const deauth = async (token: any) => {
		const deauthUrl = queryString.stringifyUrl({
			url: 'https://www.strava.com/oauth/deauthorize',
			query: { access_token: token },
		});
		const res = await fetch(deauthUrl, {
			method: 'POST',
			// headers: { Authorization: `Bearer ${token}` },
		});
	};

	// const fetchActivities = async (token: any) => {
	const fetchActivities = async () => {
		const res = await fetch(
			'https://www.strava.com/api/v3/athlete/activities',
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${'ee5a95fc991da8757ce5422de974ce3f3a25e3d3'}`,
				},
			}
		);

		console.log(res);
	};

	return (
		<>
			<div className='App'>DoomStats!</div>
			<section>
				<p>Auth Strava</p>
				{!redirected ? (
					<a href={stravaOAuth}>Do it!</a>
				) : (
					<p>Stats time</p>
				)}
			</section>
			{redirected && attemptedAuth && (
				<button onClick={fetchActivities}>Fetch activities?</button>
			)}
			{redirected && attemptedAuth && (
				<button onClick={() => deauth(code)}>DeAuth</button>
			)}
		</>
	);
};

export default App;
