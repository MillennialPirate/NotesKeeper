import React, { Component } from 'react';
import './create.css';
import { Button } from 'react-bootstrap';
import Signin from './SignIn';
import Cards from './card';
import { db } from "../firebase/firebase";
import Edit from './Edit';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

recognition.continous = true
recognition.interimResults = true
recognition.lang = 'en-US'
class create extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            title: "",
            content: "",
            notes: [],
            status: "loggedin",
            selected: "",
            selectedContent: "",
            listening: false
        };
        this.uid = this.props.uid;
        this.onChangeInput = this.onChangeInput.bind(this);
        this.add = this.add.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.delete = this.delete.bind(this);
        this.edit = this.edit.bind(this);
        this.toggleListen = this.toggleListen.bind(this);
        this.handleListen = this.handleListen.bind(this);
    }
    handleListen()
    {
        console.log('listening?', this.state.listening)

    if (this.state.listening) {
      recognition.start()
      recognition.onend = () => {
        console.log("...continue listening...")
        recognition.start()
      }

    } else {
      recognition.stop()
      recognition.onend = () => {
        console.log("Stopped listening per click")
      }
    }

    recognition.onstart = () => {
      console.log("Listening!")
    }

    let finalTranscript = ''
    recognition.onresult = event => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interimTranscript += transcript;
      }
    //   document.getElementById('interim').innerHTML = interimTranscript
    //   document.getElementById('final').innerHTML = finalTranscript
    console.log(finalTranscript);
    this.setState({content: finalTranscript});

    //-------------------------COMMANDS------------------------------------

      const transcriptArr = finalTranscript.split(' ')
      const stopCmd = transcriptArr.slice(-3, -1)
      console.log('stopCmd', stopCmd)

      if (stopCmd[0] === 'stop' && stopCmd[1] === 'listening'){
        recognition.stop()
        recognition.onend = () => {
          console.log('Stopped listening per command')
          const finalText = transcriptArr.slice(0, -3).join(' ')
          document.getElementById('final').innerHTML = finalText
        }
      }
    }
    
  //-----------------------------------------------------------------------
    
    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error)
    }
    }
    toggleListen() {
        this.setState({
          listening: !this.state.listening
        }, this.handleListen)
      }
    
    edit(title, content)
    {
        console.log(title);
        this.setState({selectedContent: content});
        this.setState({selected: title});
        this.setState({status: "viewAndEdit"});
    }
    async delete(title) {
        // //delete data from the notes array
        for (var i = 0; i < this.state.notes.length; i++) {
            if (this.state.notes[i].title === title) {
                this.state.notes.splice(i, 1);
                i--;
            }
        }
        //delete from the databse
        const res = await db.collection(this.uid).doc(title).delete();
        this.setState({ status: "deleted" });
    }
    async componentDidMount() {
        const collections = db.collection(this.uid);
        const snapshot = await collections.get();
        if (snapshot.empty) {
            console.log("No matching document");
        }
        snapshot.forEach(doc => {
            console.log(doc.id, ' => ', doc.data().content);
            var data = {
                title: doc.id,
                content: doc.data().content
            };
            this.state.notes.push(data);
        });
        this.setState({ status: "Edit" });
    }
    onChangeInput(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value });
    }
    add() {
        if (this.state.title === "") {
            window.alert("Please give a title");
            return;
        }
        db.collection(this.uid).doc(this.state.title).set({
            content: this.state.content
        })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                window.alert("Please fill it correctly");
            });
        var data = {
            title: this.state.title,
            content: this.state.content
        }
        this.state.notes.push(data);
        this.setState({ status: "added" });
    }
    checkStatus() {
        if (this.state.status === "loggedin") {
            return <div style={{ width: "100%", background: "#f1f1f1", opacity: "0.9" }}>
                <div className="full">
                    <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "4rem", fontWeight: "bolder", textAlign: "center" }}>NotesKeeper</h1>

                    <div style={{ paddingLeft: "2%", paddingTop: "2%" }} onChange={(e) => { this.onChangeInput(e) }}>
                        <div style={{ paddingBottom: "2%" }}>
                            <input className="input1" type="text" name="title" placeholder="Title" />
                        </div>
                        <div>
                            <textarea name = "content" placeholder = "Create your story..." value = {this.state.content}></textarea>
                        </div>
                        <div style={{ paddingTop: "2%" }}><Button variant="success" onClick={this.add}>Add</Button>{' '}<button style={{ background: "red" }} onClick={() => { this.setState({ status: "logout" }) }}>Logout</button></div>{' '}<button style = {{background: "black"}} onClick={this.toggleListen}>Speak</button>
                    </div>

                </div>

            </div>
        }
        if (this.state.status === "logout") {
            return <Signin />
        }
        if (this.state.status === "Edit" || this.state.status === "added") {
            return <div><div style={{ width: "100%",background: "#f1f1f1" , opacity: "0.9"}}>
                <div className="full">
                    <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "4rem", fontWeight: "bolder", textAlign: "center" }}>NotesKeeper</h1>

                    <div style={{ paddingLeft: "2%", paddingTop: "2%" }} onChange={(e) => { this.onChangeInput(e) }}>
                        <div style={{ paddingBottom: "2%" }}>
                            <input className="input1" type="text" name="title" placeholder="Title" />
                        </div>
                        <div>
                            <textarea name = "content" placeholder = "Create your story..." value = {this.state.content}></textarea>
                        </div>
                        <div style={{ paddingTop: "2%" }}><Button variant="success" onClick={this.add}>Add</Button>{' '}<button style={{ background: "green" }} onClick={() => { this.setState({ status: "logout" }) }}>Logout</button>{' '}<button style = {{background: "black"}} onClick={this.toggleListen}>Speak</button></div>
                    </div>

                </div>

            </div><div>
                    {
                        this.state.notes && this.state.notes.reverse().map(note => {
                            // return (<div><h1>{note.title}</h1><p>{note.content}</p></div>);

                            //for deleting we ll be passing function as a prop to the card
                            return <section><Cards title={note.title} content={note.content} uid={this.uid} /><div style={{ paddingTop: "5%", paddingLeft: "5%" }}><button style={{ background: "red", color: "white" }} onClick={() => { this.delete(note.title, note.content) }}>Delete</button>{' '}<button style={{ background: "orange", color: "white" }} onClick={() => { this.edit(note.title) }}>Edit</button></div></section>
                        })
                    }
                </div></div>
        }
        if (this.state.status === "deleted") {
            return <div><div style={{ width: "100%",background: "#f1f1f1" , opacity: "0.9"}}>
                <div className="full">
                    <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "4rem", fontWeight: "bolder", textAlign: "center" }}>NotesKeeper</h1>

                    <div style={{ paddingLeft: "2%", paddingTop: "2%" }} onChange={(e) => { this.onChangeInput(e) }}>
                        <div style={{ paddingBottom: "2%" }}>
                            <input className="input1" type="text" name="title" placeholder="Title" />
                        </div>
                        <div>
                            <textarea name = "content" placeholder = "Create your story..." value = {this.state.content}></textarea>
                        </div>
                        <div style={{ paddingTop: "2%" }}><Button variant="success" onClick={this.add}>Add</Button>{' '}<button style={{ background: "green" }} onClick={() => { this.setState({ status: "logout" }) }}>Logout</button></div>{' '}<button style = {{background: "black"}} onClick={this.toggleListen}>Speak</button>
                    </div>

                </div>

            </div><div>
                    {
                        this.state.notes && this.state.notes.reverse().map(note => {
                            // return (<div><h1>{note.title}</h1><p>{note.content}</p></div>);

                            //for deleting we ll be passing function as a prop to the card
                            return <section><Cards title={note.title} content={note.content} uid={this.uid} /><div style={{ paddingTop: "5%", paddingLeft: "5%" }}><button style={{ background: "red", color: "white" }} onClick={() => { this.delete(note.title) }}>Delete</button>{' '}<button style={{ background: "orange", color: "white" }} onClick={() => { this.edit(note.title, note.content) }}>Edit</button></div></section>
                        })
                    }
                </div></div>
        }
        if(this.state.status === "viewAndEdit")
        {
            return <Edit title = {this.state.selected} content = {this.state.selectedContent} uid = {this.uid}/>
        }
    }
    render() {
        return (
            this.checkStatus()
        )
    }
}
export default create;