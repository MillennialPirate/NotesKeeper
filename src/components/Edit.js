import React from 'react';
import {Button} from 'react-bootstrap';
import Create from './create';
import {db} from '../firebase/firebase';
class Edit extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            uid: this.props.uid,
            title: this.props.title,
            content: this.props.content,
            newContent: "",
            status: "edit"
        }
        this.edit = this.edit.bind(this);  
        this.onChangeInput = this.onChangeInput.bind(this); 
    }
    onChangeInput(event)
    {
        event.preventDefault();
        const name = event.target.name;
        const value = event.target.value;
        this.setState({newContent: value});
    }
    componentDidMount()
    {
        console.log(this.state);
    }
    async edit()
    {
        const data = {
            content: this.state.newContent
        }
        const res = await db.collection(this.state.uid).doc(this.state.title).set(data);
        this.setState({status: "back"});
    }
    checkStatus()
    {
        if(this.state.status === "edit")
        {
            return <div style={{ width: "100%" , background: "#f1f1f1", opacity: "0.9"}}>
            <div className="full">
                <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "4rem", fontWeight: "bolder", textAlign: "center" }}>NotesKeeper</h1>

                <div style={{ paddingLeft: "2%", paddingTop: "2%" }} >
                    <div style={{ paddingBottom: "2%" }}>
                        <input className="input1"  value = {this.state.title} />
                    </div>
                    <div onChange={(e) => { this.onChangeInput(e) }}>
                        <textarea name = "content" placeholder = "Create your story..."></textarea>
                    </div>
                    <div style={{ paddingTop: "2%" }}><Button variant="success" onClick={this.edit}>Edit</Button>{' '}<button style={{ background: "red" }} onClick={() => { this.setState({ status: "back" }) }}>Back</button></div>
                </div>

            </div>

        </div>
        }
        if(this.state.status === "back")
        {
            return <Create uid = {this.state.uid}/>
        }
    }
    render()
    {
        return this.checkStatus();
    }
}
export default Edit;