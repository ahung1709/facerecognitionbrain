import React, { useState, useEffect } from 'react';
import API_URL from './config';
import {
  getAuthTokenFromSession,
  clearAuthTokenFromSession,
} from './utils/auth';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import './App.css';

const initialInputState = '';
const initialImageUrlState = '';
const initialBoxesState = [];
const initialRouteState = 'signin';
const initialIsSignedInState = false;
const initialIsProfileOpen = false;
const initialUserState = {
  id: '',
  name: '',
  email: '',
  entries: 0,
  age: 0,
  pet: '',
  joined: '',
};

function App() {
  const [input, setInput] = useState(initialInputState);
  const [imageUrl, setImageUrl] = useState(initialImageUrlState);
  const [boxes, setBoxes] = useState(initialBoxesState);
  const [route, setRoute] = useState(initialRouteState);
  const [isSignedIn, setIsSignedIn] = useState(initialIsSignedInState);
  const [isProfileOpen, setIsProfileOpen] = useState(initialIsProfileOpen);
  const [user, setUser] = useState(initialUserState);

  useEffect(() => {
    const token = getAuthTokenFromSession();

    if (token) {
      fetch(`${API_URL}/signin`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data && data.id) {
            fetch(`${API_URL}/profile/${data.id}`, {
              method: 'get',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            })
              .then((resp) => resp.json())
              .then((user) => {
                if (user && user.email) {
                  loadUser(user);
                  onRouteChange('home');
                }
              });
          }
        })
        .catch(console.log);
    }
  }, []);

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      age: data.age,
      pet: data.pet,
      joined: data.joined,
    });
  };

  const onSignOut = () => {
    const token = getAuthTokenFromSession();

    fetch(`${API_URL}/signout`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .catch(console.log)
      .finally(() => {
        clearAuthTokenFromSession();

        onRouteChange('signout');
      });
  };

  const calculateFaceLocations = (data) => {
    if (data && data.outputs) {
      return data.outputs[0].data.regions.map((face) => {
        const clarifaiFace = face.region_info.bounding_box;

        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - clarifaiFace.right_col * width,
          bottomRow: height - clarifaiFace.bottom_row * height,
        };
      });
    }
    return;
  };

  const displayFaceBoxes = (boxes) => {
    if (boxes) {
      setBoxes(boxes);
    }
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onButtonSubmit = () => {
    setImageUrl(input);

    fetch(`${API_URL}/imageurl`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthTokenFromSession()}`,
      },
      body: JSON.stringify({
        input: input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          fetch(`${API_URL}/image`, {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getAuthTokenFromSession()}`,
            },
            body: JSON.stringify({
              id: user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              setUser({ ...user, entries: count });
            })
            .catch(console.log);
        }
        displayFaceBoxes(calculateFaceLocations(response));
      })
      .catch((err) => console.log(err));
  };

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setInput(initialInputState);
      setImageUrl(initialImageUrlState);
      setBoxes(initialBoxesState);
      setRoute(initialRouteState);
      setIsSignedIn(initialIsSignedInState);
      setIsProfileOpen(initialIsProfileOpen);
      setUser(initialUserState);
      return;
    } else if (route === 'home') {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  const toggleModal = () => {
    setIsProfileOpen((prevState) => !prevState);
  };

  return (
    <div className='App'>
      <ParticlesBg
        className='particles'
        type='cobweb'
        color='#ffffff'
        bg={true}
      />
      <Navigation
        isSignedIn={isSignedIn}
        onRouteChange={onRouteChange}
        onSignOut={onSignOut}
        toggleModal={toggleModal}
      />
      {isProfileOpen && (
        <Modal>
          <Profile
            isProfileOpen={isProfileOpen}
            toggleModal={toggleModal}
            loadUser={loadUser}
            user={user}
          />
        </Modal>
      )}
      {route === 'home' ? (
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
        </div>
      ) : route === 'signin' ? (
        <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
      ) : (
        <Register loadUser={loadUser} onRouteChange={onRouteChange} />
      )}
    </div>
  );
}

export default App;
