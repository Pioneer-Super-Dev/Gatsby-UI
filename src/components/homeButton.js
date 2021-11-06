import React, {Component} from "react";

import {home__button} from './homeButton.module.css';

class HomeButton extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const title = this.props.title;
        const color = this.props.color;
        return(
            <button className={home__button} style = {{color:color}} onClick = {()=>this.props.onClick()}>{title}</button>
        )
    }
}

export default HomeButton;