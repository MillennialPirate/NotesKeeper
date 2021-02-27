import Create from './create';
import React, { Component } from 'react';
import './signin.css';
import { slideInLeft, slideInRight, slideInUp } from 'react-animations';
import Radium, { StyleRoot } from 'radium';
import photo from './images.jpg';
import { auth } from "../firebase/firebase";
import Signup from './Signup';
import { db } from "../firebase/firebase";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import photo1 from './bg.jpg'
const styles = {
    slideInUp: {
        animation: 'x 1s',
        animationName: Radium.keyframes(slideInUp, 'slideInUp')
    }
}
const styles1 = {
    slideInRight: {
        animation: 'x 2s',
        animationName: Radium.keyframes(slideInRight, 'slideInRight')
    }
}
const styles2 = {
    slideInLeft: {
        animation: 'x 2s',
        animationName: Radium.keyframes(slideInLeft, 'slideInLeft')
    }
}
class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            userid: "",
            clicked: "sign in"
        };
        this.changeToSignup = this.changeToSignup.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.login = this.login.bind(this);
    }
    login() {
        auth.signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((user) => {
                this.setState({ userid: user.user.uid });
                console.log(this.state.userid);
                this.setState({ clicked: "logged in" });
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
            });
    }
    onChangeInput(event) {
        const name = event.target.name; //name of the target attribute
        const value = event.target.value; // value filled in the target attribute 
        this.setState({ [name]: value });

    }
    changeToSignup() {
        this.setState({ clicked: "sign up" });
    }
    currentState() {
        if (this.state.clicked === "sign in") {

            return <body style={{ height: "100vh", background: { photo1 }, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}><div className="total">
                <StyleRoot><div style={styles2.slideInLeft}><div style={{ paddingRight: "5%", }}><h1 style={{ fontFamily: "'Poppins', sans-serif", color: "black", fontSize: "3.5rem" }}>Welcome to NotesKeeper!</h1></div></div></StyleRoot>
                <StyleRoot>
                    <div className="app" style={styles.slideInUp}>
                        <div className="bg"></div>

                        <form onChange={(e) => this.onChangeInput(e)}>
                            <header>
                                <StyleRoot><img src={photo} style={styles1.slideInRight} /></StyleRoot>
                            </header>

                            <div className="inputs">
                                <input type="text" name="email" placeholder="email" />
                                <input type="password" name="password" placeholder="password" />
                            </div>

                        </form>

                        <footer>
                            <button className="button1" onClick={this.login}>Login</button>
                            <p>Don't have an account? <a href="#" onClick={this.changeToSignup}>Sign Up</a></p>
                        </footer>


                    </div>
                </StyleRoot>
            </div></body>
        }
        if (this.state.clicked === "sign up") {
            return <Signup />
        }
        if (this.state.clicked === "logged in") {
            return <Create uid={this.state.userid} />
        }
    }
    render() {
        return this.currentState();
    }
}
export default Signin;