import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'c3029c1637084dfaa5452d0f092c81d5'
})

class App extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  calculateFaceLocaction = (data) => {
    // specify the face detection bounding box parameters via api response
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    // console.log('data: ', data)
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

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  displayFaceBox = (box) => {
    console.log('state box ', this.state.box)
    console.log('box ', box)
    this.setState({box: box})
    console.log('state box 2 ', this.state.box)
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    // this seems to only work with provided sample key: a403429f2ddf4b49b307e318f00e528b
    app.models.predict(
      // Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
      // Check Face Detect Mode: https://www.clarifai.com/models/face-detection
      // If that isn't working, then that means you will have to wait until their servers are back up. OR
      // use a different version of their model that works like: `c0c0ac362b03416da06ab3fa36fb58e3`
      // change from:
      // .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      // to:
      // .predict('c0c0ac362b03416da06ab3fa36fb58e3', this.state.input)
      Clarifai.FACE_DETECT_MODEL, // which clarifai model we use
      this.state.input) // url of image being passed to api
    .then(response => {
      if (response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id,
          })
        })
        .then(res => res.json())
        .then(count => {
          // Object.assign to avoid replacing entire state; only change 'entries'
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
      }
      // console.log('response on submit: ', response)
      this.displayFaceBox(this.calculateFaceLocaction(response))
    })
    .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    const { isSignedIn, imageUrl, route, box} = this.state;
    // console.log('state of the box obj: ', this.state.box)
    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' 
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
            route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
            )
        }
      </div>
    )
  }
}

export default App;
