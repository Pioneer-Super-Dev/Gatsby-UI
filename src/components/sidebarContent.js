import React, {Component} from "react";

import {left__bar, sunnybrook__logo, left__bar__description, left__bar__description__container} from './sidebarContent.module.css';
import {core__copyrights} from '../pages/style.module.css';

class SidebarContent extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const text = this.props.case;
        let element;
        switch(text){
            case "donors-list":
                element = <p className={left__bar__description}>
                    This is your list of donors, organized by giving level beginning with invdividual donors and followed by organizational
                    donors. To edit a donor, click the Pencil icon to the right of the donor giving level to enter that group. You can also
                    mass add donor names in a full group by downloading the CSV template at the top of this page. Currently this feature is
                    working but requires pretty exact data, so
                    please reach out to our support staff at <a href="support@envision.design">support@envision.design</a> to get
                    some help if you would like to add a new full group of donors.
                </p>
                break;
            case "denors":
                element = <p className={left__bar__description}>
                    In this menu you can change your donor names within the desired giving level. Click the Pencil icon to the right of the
                    Donor Name to edit that name and/or sort letter, and then click the green disk icon to save the change, or the red back
                    arrow to discard the change. A user can also delete a Donor Name by clicking the red garbage bin icon to the left of
                    the edit button. To add a new Donor Name, use the Donor Name and Sort Letter fields above the donor listing and click
                    the green Add New Donor button. Please note that due to complexities in sorting the donor names, a new donor will
                    always appear at the bottom of the list. We are working to make this more logical for phase 2, but currently due to
                    sorting individuals seperately from organizations, it must be this way. The sort of the Donor Name can be altered by
                    using the Up and/or Down arrows to the left of the Donor Name. The placement in the web portal reflects which order
                    they will appear on the screens.
                </p>
                break;
            case "users":
                element = <p className={left__bar__description}>
                    This is the page where you define the users of your CMS system. To add a new user, click the Add User button on the top
                    right of the screen then fill in the details and remember to check the Administrator checkbox if you want that user to
                    be able to create other users.
                </p>
                break;
            case "playlist":
                element =<p className={left__bar__description}>
                    Here is where we build the playlist. Currently it is inactive until we more succintly define exactly what the best
                    process for your team to update the playlists will be. It can be a very powerful tool with the ability to update the
                    current playlist immediately, or we can build out 'scenes' or 'scenearios' for you to apply media assets to. This will
                    be more well defined in Phase 2.
                </p>
                break;
            case "playlist-details":
                element =<p className={left__bar__description}>
                    This is where the individual media elements that build out the full playlists are defined. Prior to this screen you
                    chose either the left or right playlist, the elements you add or delete here will be added or deleted to the playlist
                    on the video wall. This is powerful tool and since much time and effort were spent balancing and timing the playlist,
                    we would like to have an ongoing dialogue with the Sunnybrook Foundation about what shape they would like this feature
                    to take. Currently changes to this page will NOT be reflected on the video wall, until we totally define how much of
                    the content scope the Foundation is comfortable taking on. It may be preferable to build out pre-defined scenes or
                    scenarios that the foundation can select and add media to instead of full on scheduling.
                </p>
                break;
            case "media":
                element = <p className={left__bar__description}>
                    This is the media page.
                </p>
                break;
            case "takeover":
                element = <p className={left__bar__description}>
                    On this page a user can attach media elements that they would like Envision to book for a temporary takeover of the
                    screens, similar to the Cipriani and Helipad events in the past. You can attach images for both the left and right of
                    the screen which will then be analyzed by our support team for suitability and programmed. Please allow at least 24
                    hours notice for scheduling at this time. This is a temporary solutiuon until we full realize the scheduling feature.
                </p>
                break;
        }
        return(
            <div className={left__bar}>
                <div className={sunnybrook__logo}></div>

                <div className={left__bar__description__container}>
                    {element}
                </div>
                <div className = {core__copyrights}>
                    <p>Copyright 2018 &copy;</p>
					<p>All Rights Reserved, Envision</p>
                </div>
            </div>
        )
    }
}

export default SidebarContent;