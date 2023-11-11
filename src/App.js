import React, {useState} from 'react';
import ParticlesBg from 'particles-bg'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

function App() {

  const [input, setInput] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [box, setBox] = useState({})
  const [route, setRoute] = useState('signin')
  const [isSignedIn, setIsSignedIn] = useState(false)

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
        .then(response => displayFaceBox(calculateFaceLocation(response))) 
        .catch(err => console.log(err));
  }

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false)
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
            <Rank />
            <ImageLinkForm 
              onInputChange={onInputChange} 
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
        : (
          route === 'signin' 
          ? <Signin onRouteChange={onRouteChange}/>
          : <Register onRouteChange={onRouteChange}/>
        )
      }
    </div>
  );
}

export default App;
