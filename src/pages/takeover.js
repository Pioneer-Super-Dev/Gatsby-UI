import React, {Component} from "react";

import Header from "../components/header";
import {main__view, part__screen__container} from './style.module.css';
import SidebarContent from "../components/sidebarContent";

import {takeover__overflow, takeover__container, takeover__button__container, takeover__leftitem, takeover__label, 
    takeover__text, takeover__image, takeover__button__text__container, takeover__screenshot, takeover__gap} from './takeover.module.css';

import leftImage from '../images/takeover-left.png';
import rightImage from '../images/takeover-right.png';
import takeoverImage from '../images/takeover-screenshot.png'
import {isLoggedIn} from "../services/auth"
import {navigate} from 'gatsby'

class TakeoverPage extends Component{
    componentDidMount(){
        if(!isLoggedIn() ){
            navigate('/login')
        }
    }
    render(){
        
        return(
            <React.Fragment>
                <Header/>
                <div className={main__view}>
                    <SidebarContent case = "takeover">
                    </SidebarContent>
                    <div className={part__screen__container}>
                        <div className={takeover__overflow}>
                            <div className = {takeover__container}>
                                <div className = {takeover__leftitem}>
                                    <p className={takeover__label}>Left canvas</p>
                                    <img className={takeover__image} src={leftImage} alt=""/>
                                    <div className={takeover__text}>
                                        <span><b>Note: </b></span>
                                        <p>For best results, please upload an image that is the same aspect ratio as the above <b>5760 x 4320</b> pixel canvas. This <b>4:3 aspect ratio,</b> which is very common, however please also consider the missing display at the bottom right of the canvas when considering an image for use.</p>
                                    </div>
                                </div>
                                <div className = {takeover__leftitem}>
                                    <p className = {takeover__label}>Right Canvas</p>
                                    <img className = {takeover__image} src = {rightImage} alt = ""/>
                                    <div className = {takeover__text}>
                                        <span><b>Note: </b></span>
                                        <p>For best results, please upload an image that is the same aspect ratio as the above <b>3840 x 3240</b> pixel canvas. This <b>32:27 aspect ratio,</b> which is not common, but should be easy to format by a graphic designer or web designer based on the above pixel dimensions.</p>
                                    </div>
                                </div>
                            </div>
                            <div className = {takeover__button__container}>
                                <div className = {takeover__button__text__container}>
                                    <p><b>Please click the Send with WeTransfer button below to attached and send your desired assets to us for review and we will respond to confirm the timing of your request.</b></p>
                                    <p><b>Please also add the required date and time to the Message field on the WeTransfer page when you are ready to upload your assets. A member of the Envision support team will be in contact to confirm details.</b></p>
                                    <img className = {takeover__screenshot} src = {takeoverImage} alt = ""></img>
                                    <p><b>If you are submitting multiple assets per side (i.e 3 left and 3 right assets please name them accordingly as left_1.tif, left_2.tif, left_3.tif, right_1.tif, right_2.tif, right_3.tif etc...)</b></p>
                                    <p><b>For best results, please use only the .TIF, .PNG image formats as they maintain the Alpha channel for transparency, i.e using the right canvas for the text with the background shown.</b></p>
                                </div>
                                <div className = {takeover__gap}>

                                </div>
                            </div>
                        </div>
                        {/* <div className = {takeover__submit}>
                            <iframe src="https://we.tl/send/en/envisionsales" width="275" height="50" frameborder="0"></iframe>
                        </div> */}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default TakeoverPage;