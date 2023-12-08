import React, {useState, useEffect} from 'react';
import ParticlesBg from 'particles-bg'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const initialInputState = ''
const initialImageUrlState = ''
const initialBoxState = {}
const initialRouteState = 'signin'
const initialIsSignedInState = false
const initialUserState = {
  id: '',
  name: '',
  email: '',
  entries: 0,
  joined: ''
}

function App() {

  const [input, setInput] = useState(initialInputState)
  const [imageUrl, setImageUrl] = useState(initialImageUrlState)
  const [box, setBox] = useState(initialBoxState)
  const [route, setRoute] = useState(initialRouteState)
  const [isSignedIn, setIsSignedIn] = useState(initialIsSignedInState)
  const [user, setUser] = useState(initialUserState)

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    })
  }

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width, 
      topRow: clarifaiFace.top_row * height, 
      rightCol: width - (clarifaiFace.right_col * width), 
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = (box) => {
    setBox(box)
  }

  const returnClarifaiRequestOptions = (imageUrl) => {
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '2556c2fbcd9041cd9a5a9a2250f426f1';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'ahappswk';       
    const APP_ID = 'test';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = imageUrl;
   
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });
  
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    return requestOptions;
  
  }

  const onInputChange = (event) => {
    setInput(event.target.value)
  }

  const onButtonSubmit = () => {
    setImageUrl(input)
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(input))
        .then(response => response.json())
        .then(response => {
          if (response) {
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  id: user.id
              })
            })
            .then(response => response.json())
            .then(count => {
              setUser({...user, entries: count })
            })
            .catch(console.log)
          }
          displayFaceBox(calculateFaceLocation(response))
        }) 
        .catch(err => console.log(err));
  }

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setInput(initialInputState)
      setImageUrl(initialImageUrlState)
      setBox(initialBoxState)
      setRoute(initialRouteState)
      setIsSignedIn(initialIsSignedInState)
      setUser(initialUserState)
    } else if (route === 'home') {
      setIsSignedIn(true)
    }
    setRoute(route)
  }

  return (
    <div className="App">
      <ParticlesBg 
        className="particles" 
        type="cobweb"
        color="#ffffff" 
        bg={true} 
      />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      { route === 'home' 
        ? <div>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm 
              onInputChange={onInputChange} 
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
        : (
          route === 'signin' 
          ? <Signin loadUser={loadUser} onRouteChange={onRouteChange}/>
          : <Register loadUser={loadUser} onRouteChange={onRouteChange}/>
        )
      }
    </div>
  );
}

export default App;
