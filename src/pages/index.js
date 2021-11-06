import {navigate} from 'gatsby'
import React, {Component} from "react";

class IndexPage extends Component {

    componentDidMount(){
        navigate("/home");
    }

    render(){
        return(
            <div></div>
        )
    }
}


export default IndexPage
