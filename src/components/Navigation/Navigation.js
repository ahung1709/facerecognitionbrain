import React from 'react';
import ReactIcon from '../Profile/ProfileIcon';

const Navigation = ({ onRouteChange, onSignOut, isSignedIn, toggleModal }) => {
  if (isSignedIn) {
    return (
      <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ReactIcon
          onRouteChange={onRouteChange}
          onSignOut={onSignOut}
          toggleModal={toggleModal}
        />
      </nav>
    );
  } else {
    return (
      <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <p
          onClick={() => onRouteChange('signin')}
          className='f3 link dim black underline pa3 pointer'
        >
          Sign In
        </p>
        <p
          onClick={() => onRouteChange('register')}
          className='f3 link dim black underline pa3 pointer'
        >
          Register
        </p>
      </nav>
    );
  }
};

export default Navigation;
