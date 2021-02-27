import React,{Component} from 'react';
import './cards.css';
class card extends Component 
{
    constructor(props)
    {
        super(props);
        this.state = {}
        this.title = this.props.title;
    }
    render()
    {
        return(
            <div>
            
            <article class="card">
                <h1>{this.props.title}</h1>
                <p>{this.props.content}</p>
                
            </article>
            </div>
        )
    }
}
export default card;