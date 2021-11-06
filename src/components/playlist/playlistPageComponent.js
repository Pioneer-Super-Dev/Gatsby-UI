import React, {useState, useEffect} from "react";

import Header from "../../components/header";
import {main__view, part__screen__container} from '../../pages/style.module.css';
import SidebarContent from "../../components/sidebarContent";
import {linkbutton, donors__list__item__header, donors__list__item__title, donors__list__item__info  } from '../../pages/donorlist.module.css';
import {playlist, playlist__item} from '../../pages/playlist.module.css';

import { gql, useQuery } from '@apollo/client';
import { Link } from "gatsby";

const GET_PLAYLIST = gql`
    query Myquery {
        playlists{
            playlistKey,
            placement,
            startTime,
            endTime,
            author,
            name
        }
    }
`

export function PlaylistPageComponent(){
    const {loading, error, data } = useQuery(GET_PLAYLIST);
    
    const [playlistData, setPlaylistData] = useState([]);
    const [playlistChanged, setPlaylistChanged] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);

    useEffect(()=>{
        if ( !loading){
            const newData = []
            data.playlists.map((item, key ) =>{
                const startDate = item.startTime.split("T")[0]
                const endDate = item.endTime.split("T")[0]
                const startTime = item.startTime.split("T")[1].split(".")[0];
                const endTime = item.endTime.split("T")[1].split(".")[0];
                const newItem = {id: item.id, playlistKey:item.playlistKey, name: item.name, author: item.author,
                    placement:item.placement, startDate: startDate, endDate: endDate, startTime: startTime,endTime: endTime}
                newData.push(newItem);
            })
            setPlaylistData(newData); 
            setPlaylistChanged(!playlistChanged);
        }
    }, [firstLoad])

    if (firstLoad){
        if (!loading){
            setFirstLoad(false);
        }
    }
    return(
        <div>
        <Header/>
        <div className={main__view}>
            <SidebarContent case = "playlist">
            </SidebarContent>

            <div className={part__screen__container}>
                <div className={playlist}>
                    {
                        playlistData&&(
                            playlistData.map((item, key)=>
                            <div className={playlist__item} key = {key}>
                                <div className={donors__list__item__header}>
                                    <p className={donors__list__item__title}>{item.name}</p>
                                    {/* <button className= {linkbutton}></button> */}
                                    <Link className = {linkbutton} to ={"/playlistitem?" + item.playlistKey} >   </Link>
                                </div>
                                <div className={donors__list__item__info}>
                                    <p>placement: {item.placement}  </p>
                                    <p>Author: {item.author}</p>
                                    <p>Start Date: {item.startDate}</p>
                                    <p>End Date: {item.endDate}</p>
                                    <p>Start Time: {item.startTime}</p>
                                    <p>End Time: {item.endTime}</p>
                                </div>
                            </div>
                                
                             ) 
                        )
                    }
                </div>
            </div>
        </div>
    </div>
    )
    
}