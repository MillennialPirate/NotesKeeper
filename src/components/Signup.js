
import React, { Component } from 'react';
import './signin.css';
import Create from './create'
import { slideInLeft, slideInRight, slideInUp } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import photo from './images.jpg';
import { auth } from "../firebase/firebase";
import { db } from "../firebase/firebase";
import Sigin from './SignIn';
const styles = {
    slideInUp: {
      animation: 'x 1s',
      animationName: Radium.keyframes(slideInUp, 'slideInUp')
    }
  }
const styles1 = {
    slideInRight:{
        animation: 'x 2s',
        animationName: Radium.keyframes(slideInRight, 'slideInRight')
    }
}
const styles2 = {
    slideInLeft:{
        animation: 'x 2s',
        animationName: Radium.keyframes(slideInLeft, 'slideInLeft')
    }
}
class Signup extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            email: "",
            password: "",
            userid: "",
            clicked: "sign up"
        }
        this.changeToSignin = this.changeToSignin.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.register = this.register.bind(this);
    }
    register()
    {
        auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
        // console.log(user.user.uid);
        console.log("success");
        this.setState({userid: user.user.uid});
        this.setState({clicked: "registered"});
      })
      .catch((err) => {
        console.log(err);
        switch (err.code) {
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            this.setState({ emailError: err.message });
            window.alert("Try again : " + err.message);
            break;
          case "auth/weak-password":
            this.setState({ passwordError: err.message });
            window.alert("Weak password");
            break;
          default: console.log("Hello");
        }
      });
    }
    onChangeInput(event) 
    {
        const name = event.target.name; //name of the target attribute
        const value = event.target.value; // value filled in the target attribute 
        this.setState({ [name]: value });
    }
    changeToSignin()
    {
        this.setState({clicked: "sign in"});
    }
    checkState()
    {
        if(this.state.clicked === "sign up")
        {
            return <div className = "total">
            <StyleRoot><div style = {styles2.slideInLeft}><div style = {{paddingRight: "5%", }}><h1 style={{  fontFamily: "'Poppins', sans-serif",color: "black", fontSize: "3.5rem" }}>Create an account!</h1></div></div></StyleRoot>
            <StyleRoot>
                <div className="app" style={styles.slideInUp}>
                    <div className="bg"></div>

                    <form onChange={(e) => this.onChangeInput(e)}>
                        <header>
                            <StyleRoot><img src={photo} style = {styles1.slideInRight} /></StyleRoot>
                        </header>

                        <div className="inputs">
                            <input type="text" name="email" placeholder="email" />
                            <input type="password" name="password" placeholder="password" />
                        </div>

                    </form>

                    <footer>
                        <button className = "button1" onClick = {this.register}>Register</button>
                        <p>To go back<a href="#" onClick = {this.changeToSignin}> Click here</a></p>
                    </footer>


                </div>
                </StyleRoot>
            </div>
        }
        if(this.state.clicked === "sign in")
        {
            return <Sigin/>
        }
        if(this.state.clicked === "registered")
        {
            return <Create uid = {this.state.userid}/>
        }
    }

    render() {
        return this.checkState();
    }
}
export default Signup;