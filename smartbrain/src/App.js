import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'c3029c1637084dfaa5452d0f092c81d5'
})

// test ssh
const particlesOptions = {
  "particles": {
    "number": {
            "value": 30,
            "density": {
              "enable": true,
              "value_area": 800
            }
          }
        },
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: {}
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

  displayFaceBox = (box) => {
    // console.log('state box ', this.state.box)
    // console.log('box ', box)
    this.setState({box: box})
    // console.log('state box 2 ', this.state.box)
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    // this seems to only work with provided sample key: a403429f2ddf4b49b307e318f00e528b
    app.models.predict(
        Clarifai.FACE_DETECT_MODEL, // which clarifai model we use
        this.state.input) // url of image being passed to api
    .then(response => {
      // console.log('response on submit: ', response)
      this.displayFaceBox(this.calculateFaceLocaction(response))
    })
    .catch(err => console.log(err))
  }

  render() {
    console.log('state of the box obj: ', this.state.box)
    return (
      <div className="App">
        <Particles className="particles" parms={particlesOptions}/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
      </div>
    )
  }
}

// function App() {
//   return (
//     <div className='App'>
//       <Particles className='particles' params={particlesOptions} />
//       <Navigation />
//       <Logo />
//       <Rank />
//       <ImageLinkForm />
//       {/*
//       <FaceRecognition/>*/}
//     </div>
//   );
// }

export default App;
