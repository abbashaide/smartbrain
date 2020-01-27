import React from 'react';
import './Navigation.css';

const Navigation = ({ onRouteChange, isSignedIn }) => {
	if(isSignedIn){
		return(
			<nav>
			<p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 point'>Sign Out!</p>
		</nav>
		)
	}else{
		return (
		<nav>
			<p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 point'>Sign In!</p>
			<p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 point'>Register!</p>
		</nav>
	)
	}
}


export default Navigation;


// we used if and else instead of ternary just to show how to do both