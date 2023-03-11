import './App.css';

const App = () => {
	const stravaAuth =
		'https://www.strava.com/oauth/authorize?client_id=<CLIENT_ID></CLIENT_ID>&response_type=code&redirect_uri=http://localhost:5173&approval_prompt=force&scope=read';

	return (
		<>
			<div className='App'>DoomStats!</div>
			<section>
				<p>Auth Strava</p>
				<a href={stravaAuth}>Do it!</a>
			</section>
		</>
	);
};

export default App;
