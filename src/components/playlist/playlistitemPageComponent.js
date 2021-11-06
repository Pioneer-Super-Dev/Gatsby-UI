import React, { useEffect, useState} from "react";
import { gql, useQuery, useMutation } from '@apollo/client';

import Header from "../header";
import {main__view, part__screen__container, part__screen__with__refresh, part__screen__refresh__button, 
    part__screen__refresh__button__container, deleteBtn, editBtn, saveBtn, viewBtn,
     } from '../../pages/style.module.css';
import {donors__edit__title__box, donors__edit__list__title, saveButton, deleteButton} from '../../pages/donoritem.module.css';
import {  icon, donors__list, donors__list__item, donors__list__item__header, donors__list__item__info } from '../../pages/donorlist.module.css';
import { playitems__edit__add__donor} from '../../pages/playlist.module.css';
import SidebarContent from "../sidebarContent";
import { AddPlaylist } from "./addPlaylist";
import { AddPlaylistItemModal } from "./addPlaylistItemModal";
import { DeletePlaylistModal } from "./deletePlayListModal";
import { DeletePlayItemModal } from "./deletePlayItemModal";

import { Row, Col, Card, CardBody, CardTitle, CardImg, Table, Button, Input } from "reactstrap";
import leftImage from '../../images/takeover-left.png';
import checkedImage from '../../images/checked.png';
import uncheckedImage from '../../images/unchecked.png';

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
const client1 = new ApolloClient({
    uri: "https://api-us-east-1.graphcms.com/v2/ckso8s3um1hfq01y25hh4h6ri/master",
    cache: new InMemoryCache(),
  });  

const GET_PLAYITEM = gql`
    query Myquery{
        playlistSequences{
            id,
            playOrder,
            duration,
            transitionType,
            transitionDuration,
            layout,
            layoutTitle,
            solo,
            playlist{
                playlistKey
            }
        }
    }
`
export function PlaylistitemPageComponent(selectPlaylistkey){
    const {loading, error, data } = useQuery(GET_PLAYITEM);
    const [editTitle, setEditTitle]  = useState (false);
    const [selectedTitleBox, setSeletectedTitleBox] = useState('');
    const [originalTitle, setOriginalTitle] = useState('');

    const [playlistData, setPlaylistData] = useState([]);
    const [playlistChanged, setPlaylistChanged] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);

    useEffect(()=>{
        if ( !loading){
            const newData = []
            data.playlistSequences.map((item, key ) =>{
                if ( item.playlist.playlistKey === selectPlaylistkey.selectPlaylistkey){
                    setSeletectedTitleBox(item.playlist.playlistKey);
                    setOriginalTitle(item.playlist.playlistKey);
                    const newItem = {id: item.id, duration:item.duration, transitionType: item.transitionType,solo: item.solo,
                        transitionDuration:item.transitionDuration, layout: item.layout, layoutTitle: item.layoutTitle, editable: false}
                    newData.push(newItem);
                }
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
    const handleOnAdd = () =>{
        setShowModal(true);
    }
    const onExitModal = () =>{
        setShowModal(false)
    }
    const handleSeletecTitle = e => {
        setSeletectedTitleBox(e.target.value);
    }
    function EditButton() {
        if (editTitle) {
            return (
                <button className={saveButton} style = {{marginRight: '5px'}} onClick={() => { onSaveButton() }}></button>
            )
        }
        else {
            return (
                <button  style = {{marginRight: '5px'}}  onClick={() => { onEditButton() }}></button>
            )
        }
    }

    const onSaveButton = () => {
        setEditTitle(false);
    }

    const onEditButton = () => {
        setEditTitle(true);
    }

    const onDeleteButton = () => {
        setShowDeleteModal(true)
    }
    const onExitDeleteButton = () =>{
        setShowDeleteModal(false);
    }

    const onDeleteItemButton = () =>{
        setShowDeleteItemModal(true)
    }

    const onExitDeleteItemButton = () =>{
        setShowDeleteItemModal(false);
    }
    const onEditItemButton = (id) =>{
        const temp = playlistData;
        for ( var i = 0; i< temp.length; i++){
            if ( id === temp[i].id){
                temp[i].editable = true;
                continue;
            }
        }
        setPlaylistData(temp);
        setPlaylistChanged(!playlistChanged);
    }

    const onSaveItemButton = (id) =>{
        const temp = playlistData;
        for ( var i = 0; i< temp.length; i++){
            if ( id === temp[i].id){
                temp[i].editable = false;
                continue;
            }
        }
        setPlaylistData(temp);
        setPlaylistChanged(!playlistChanged);
    }

    const handleChangeDuration = (id, e)=>{
        var data=[]
        playlistData.map((item, key) =>{
            if ( item.id === id){
                const newItem = {id: item.id, duration:e.target.value, transitionType: item.transitionType,solo: item.solo,
                    transitionDuration:item.transitionDuration, layout: item.layout, layoutTitle: item.layoutTitle, editable: true}
                data.push(newItem);
            }
            else
                data.push(item);
        })
        setPlaylistData(data);
    }

    const handleChangeLayoutTitle = (id, e) =>{
        var data=[]
        playlistData.map((item, key) =>{
            if ( item.id === id){
                const newItem = {id: item.id, duration:item.duration, transitionType: item.transitionType,solo: item.solo,
                    transitionDuration:item.transitionDuration, layout: item.layout, layoutTitle: e.target.value, editable: true}
                data.push(newItem);
            }
            else
                data.push(item);
        })
        setPlaylistData(data);
    }

    const handleChangeTransitionType = (id, e) =>{
        var data=[]
        playlistData.map((item, key) =>{
            if ( item.id === id){
                const newItem = {id: item.id, duration:item.duration, transitionType: e.target.value,solo: item.solo,
                    transitionDuration:item.transitionDuration, layout: item.layout, layoutTitle: item.layoutTitle, editable: true}
                data.push(newItem);
            }
            else
                data.push(item);
        })
        setPlaylistData(data);
    }

    const handleChangeTransitionDuration = (id, e) => {
        var data=[]
        playlistData.map((item, key) =>{
            if ( item.id === id){
                const newItem = {id: item.id, duration:item.duration, transitionType: item.transitionType,solo: item.solo,
                    transitionDuration: e.target.value, layout: item.layout, layoutTitle: item.layoutTitle, editable: true}
                data.push(newItem);
            }
            else
                data.push(item);
        })
        setPlaylistData(data);
    }

    const handleChangeSolo = (id) => {
        var data=[]
        playlistData.map((item, key) =>{
            if ( item.id === id){
                const newItem = {id: item.id, duration:item.duration, transitionType: item.transitionType,solo: !item.solo,
                    transitionDuration: item.transitionDuration, layout: item.layout, layoutTitle: item.layoutTitle, editable: true}
                data.push(newItem);
            }
            else
                data.push(item);
        })
        setPlaylistData(data);
    }

    const reloadPage = () =>{
        window.location.reload();
    }
    return(
        <div>
            <Header/>
            <div className={main__view}>
                <SidebarContent case = "playlist-details">
                </SidebarContent>
                <div className={part__screen__container}>
                    <div className = {donors__edit__list__title }>
                        <div className = {donors__edit__title__box}>
                                  {
                                  editTitle?
                                  <input type="text" value = {selectedTitleBox} onChange={(e) => handleSeletecTitle(e)} />
                                  : selectPlaylistkey.selectPlaylistkey}
                        </div>
                        <button className = {deleteButton} onClick = {() => onDeleteButton()}></button>
                    </div>
                    <div className = {part__screen__with__refresh}>
                        <div className = {part__screen__refresh__button__container}>
                        <   Button color="info" style = {{marginLeft: "2em"}} onClick={() => reloadPage()}>Refresh Donors</Button>
                        </div>
                        <div className = {playitems__edit__add__donor}>
                            <AddPlaylist onClick = {() =>handleOnAdd.bind(this)}/>
                        </div>
                    </div>
                    <div className={donors__list} style = {{marginTop: "15px"}}>
                    {
                        playlistData &&
                        playlistData.map((item, key) => (
                            <div key={key} className={donors__list__item}>
                                <div className={donors__list__item__header}>
                                    {/* <p className={donors__list__item__title}>{item.donorCategoryTitle}</p> */}
                                </div>

                                <div className={donors__list__item__info}>
                                    <Row>
                                        <Col xs = "4">
                                            <Card>
                                                <CardBody>
                                                    <CardTitle>Layout type</CardTitle>
                                                </CardBody>
                                                <CardImg bottom width = "100%" src= {leftImage}></CardImg>
                                            </Card>
                                        </Col>
                                        <Col xs = "6">
                                            <Card>
                                                <CardBody>
                                                <Table>
                                                        {
                                                            item.editable ?
                                                            <tbody>
                                                                <tr>
                                                                    <td>Duration</td>
                                                                    <td><Input bsSize="sm" type="number" value = {item.duration} onChange = {(e)=> handleChangeDuration(item.id, e)}/></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Sole</td>
                                                                    <td>
                                                                        {
                                                                            item.solo?
                                                                                <img src = {checkedImage} width = "50px" onClick = {()=> handleChangeSolo(item.id)}/>
                                                                                :
                                                                                <img src = {uncheckedImage} width = "50px" onClick = {()=> handleChangeSolo(item.id)}/>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Layout Title</td>
                                                                    <td><Input bsSize="sm" type="text" value = {item.layoutTitle} onChange = {(e) => handleChangeLayoutTitle(item.id, e)}/></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>BG movie</td>
                                                                    <td><Input bsSize="sm"/></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Transition</td>
                                                                    <td><Input bsSize="sm" type="select" value = {item.transitionType} onChange = {(e) => handleChangeTransitionType(item.id, e)}>
                                                                            <option value = "none">None</option>
                                                                            <option value = "fade">Fade</option>
                                                                        </Input></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>TransitionTime(second)</td>
                                                                    <td><Input bsSize="sm" type="number" value = {item.transitionDuration} onChange = {(e) => handleChangeTransitionDuration(item.id, e)}/></td>
                                                                </tr>
                                                            </tbody>
                                                            :
                                                            <tbody>
                                                                <tr>
                                                                    <td>Duration</td>
                                                                    <td>{item.duration}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Sole</td>
                                                                    <td>{
                                                                        item.solo?
                                                                            <img src = {checkedImage} width = "50px"/>
                                                                            :
                                                                            <img src = {uncheckedImage} width = "50px"/>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Layout Title</td>
                                                                    <td>{item.layoutTitle}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>BG movie</td>
                                                                    <td></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Transition</td>
                                                                    <td>{item.transitionType}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>TransitionTime(second)</td>
                                                                    <td>{item.transitionDuration}</td>
                                                                </tr>
                                                            </tbody>
                                                        }
                                                </Table>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col xs = "2">
                                            <Card style={{height: "100%"}}>
                                                <CardBody>
                                                    <Row>
                                                        <Col xs="2"></Col>
                                                        <Col xs="8">
                                                            {item.editable?
                                                            <Button color="primary" style={{width:"100%", marginBottom:"2em"}} onClick={() => onSaveItemButton(item.id)}>Save</Button>
                                                            :
                                                            <Button color="info" style={{width:"100%", marginBottom:"2em"}} onClick={() => onEditItemButton(item.id)}>Edit</Button>
                                                            }
                                                            
                                                        </Col>
                                                        <Col xs="2"></Col>
                                                        
                                                    </Row>
                                                    <Row>
                                                        <Col xs="2"></Col>
                                                            <Col xs="8">
                                                            <Button color="danger"  style={{width:"100%", marginBottom:"1em"}} onClick={() => onDeleteItemButton()}>Delete</Button>
                                                        </Col>
                                                        <Col xs="2"></Col>
                                                    </Row>
                                            </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                    <AddPlaylistItemModal showModal = {showModal}  onExitModal = {onExitModal}></AddPlaylistItemModal>
                    <DeletePlaylistModal showModal = {showDeleteModal} onExitModal = {onExitDeleteButton}></DeletePlaylistModal>
                    <DeletePlayItemModal showModal = {showDeleteItemModal} onExitModal = {onExitDeleteItemButton}></DeletePlayItemModal>
                </div>
            </div>
        </div>
    )
}