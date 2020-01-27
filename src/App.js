import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js'
import Signin from './components/Signin/Signin.js'
import Register from './components/Register/Register.js'
import Particles from 'react-particles-js';
import './App.css';


const particleOptions = {
   particles: {
      number: {
         value: 80,         //these are just a few properties of
         density: {         //particle.js look em up to tryout more
            enable: true,
            value_area: 800
         }
      }
   }
}

class App extends Component {
  constructor() {
   super();
   this.state = {
      input: '',
      imageUrl: '',
      box: [],
      route: 'signin',  //where we are on our app so initially its the signin page
      isSignedIn: false,  //for nav bar
      user: {             //user profile
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
   }
  }

  loadUser = (data) => { //parameter naming is a choice we didnt name it user just to avoid any misconfusion
    this.setState({user: 
      {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  }

  calculateFaceLocation = (data) => {
   const clarifiFace = data.outputs[0].data.regions.map((region) => {
      return region.region_info.bounding_box;
   });
   const image = document.getElementById('inputimage');
   const width = Number(image.width);
   const height = Number(image.height);
   
   const box = clarifiFace.map((face) =>{
      return {
      leftCol: face.left_col * width,
      topRow: face.top_row * height,
      rightCol: width - (face.right_col * width),
      bottomRow: height -(face.bottom_row *height)
   }
   });
   return box;
  }

  displayFaceInBox = (box) => {
   this.setState({box: box});
  }

  onInputChange = (event) => {
   this.setState({input: event.target.value});
  }

  onPictureSubmit = () => {
   this.setState({imageUrl: this.state.input}); 
   fetch('https://salty-brook-04286.herokuapp.com/imageURL', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input                 //here if we did this.state.imageUrl it would have given an error becasue its the way react set states
      })
    })
   .then(response => response.json())
   .then(response => {
      if(response){
        fetch('https://salty-brook-04286.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count }));
        })
        .catch(console.log);
      }
      this.displayFaceInBox(this.calculateFaceLocation(response))
    })
   .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
   if(route === 'home'){
      this.setState({isSignedIn: true})
   }
   else{
      this.setState({isSignedIn: false, imageUrl: ''}); // added imageUrl to null so if we sign out the image from out home will get removed
   }
   this.setState({route: route});
  }

  render() {
   const { isSignedIn, imageUrl, box, route } =this.state;



   return (
    <div className="App">
         <Particles className='particles' params={particleOptions} />
         <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
         { route === 'home' ?
            <div>
               <Logo />
               <Rank name={this.state.user.name} entries={this.state.user.entries} />
               <ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit}/>
               <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div> :
            ( route === 'signin' ?
               <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> :
               <Register loadUser= {this.loadUser} onRouteChange={this.onRouteChange}/>
            )
         }
    </div>
  );
  }
}

export default App;

//after console logging respone we got a ton of info in return but since we are face detecting
//we narrowed it down to response.outputs[0].data.regions[0].region_info.bounding_box but here reigons can be as many as faces will be
