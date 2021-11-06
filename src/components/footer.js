import React, {Component} from "react";

import {login__copyrights} from './footer.module.css';

class Footer extends Component{
    render(){
        return(
            <div className={login__copyrights}>
                <p>Copyright 2018 ©</p>
                <p>
                    All Rights Reserved, Envision
                </p>
            </div>
        )
    }
}

export default Footer;