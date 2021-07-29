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
      imageUrl: ''
    }
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    // this seems to only work with provided sample key: a403429f2ddf4b49b307e318f00e528b
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(
      function(response) {
        console.log(response);
      },
      function(err) {
        //
      }
    );
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles" parms={particlesOptions}/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onSubmit={this.onButtonSubmit}/>
          <FaceRecognition imageUrl={this.state.imageUrl} />
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
