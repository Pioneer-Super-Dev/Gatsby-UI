import React, { useState } from "react";
import {playlist_save_entry, margin__bottom__2 } from '../../pages/style.module.css';

import { Row , Col, Alert, Button, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export function AddPlaylistItemModal({showModal, onExitModal}) {
    const [duration, setDuration] = useState(0);
    const [layout, setLayout] = useState("");
    const [title, setTitle] = useState("");
    const [movie, setMovie] = useState("");
    const [time, setTime] = useState("");
    const [type, setType] = useState("");
    const [asset, setAsset] = useState("");
    const [errorMessage, setErrorMessage ] = useState("");

    const handleChangeDuration = (e) => {
        setDuration(e.target.value);
    }

    const handleChangeLayout = (e) => {
        setLayout(e.target.value);
    }

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    }

    const handleChangeMovie = (e) =>{
        setMovie(e.target.value);
    }

    const handleChangeTime = (e) =>{
        setTime(e.target.value);
    }

    const handleChangeType = (e) =>{
        setType(e.target.type);
    }

    const handleChangeAsset = (e) => {
        setAsset(e.target.asset);
    }

    const handleCreatePlaylist = (e) =>{
        if ( duration ===0 || layout ==="" || title ==="" || movie ==="" || time ==="" || type ===""){
            setErrorMessage ("You should input all the value!");
        }
    }
    return(
        <div>
            {
                showModal &&
                <Modal isOpen={showModal}>
                    <ModalHeader>
                        Create New Playlist Entry
                    </ModalHeader>
                    <ModalBody>
                        {
                            errorMessage !==""&&
                            <Alert color="danger">{errorMessage}</Alert>
                        }
                        <FormGroup className={margin__bottom__2}>
                            <Row>
                                <Col xs= "4"><Label>Duration</Label></Col>
                                <Col xs= "8"><Input type="text" placeholder="Duration" value = {duration} onChange= {handleChangeDuration.bind(this)}/></Col>
                            </Row>
                        </FormGroup>
                        <FormGroup className={margin__bottom__2}>
                            <Row>
                                <Col xs= "4"><Label>Layout</Label></Col>
                                <Col xs= "8">
                                    <Input type="select" value={layout} onChange={handleChangeLayout.bind(this)}>
                                        <option value = "ex1"></option>
                                        <option value = "ex2"></option>
                                    </Input>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup className={margin__bottom__2}>
                            <Row>
                                <Col xs= "4"><Label>Title</Label></Col>
                                <Col xs= "8"><Input type="text" placeholder="Title" value= {title} onChange={handleChangeTitle.bind(this)}/></Col>
                            </Row>
                        </FormGroup>
                        <FormGroup className={margin__bottom__2}>
                            <Row>
                                <Col xs= "4"><Label>BG Movie</Label></Col>
                                <Col xs= "8"><Input type="text" placeholder="BG Movie" value= {movie} onChange = {handleChangeMovie.bind(this)}/></Col>
                            </Row>
                        </FormGroup>
                        <FormGroup className={margin__bottom__2}>
                            <Row>
                                <Col xs= "4"><Label>Transition Time</Label></Col>
                                <Col xs= "8"><Input type="text" placeholder="Transition Time" value = {time} onChange = {handleChangeTime.bind(this)}/></Col>
                            </Row>
                        </FormGroup>
                        <FormGroup className={margin__bottom__2}>
                            <Row>
                                <Col xs= "4"><Label>Transition Type</Label></Col>
                                <Col xs= "8">
                                    <Input type="select" value = {type} onChange={handleChangeType.bind(this)}>
                                        <option value = "none">None</option>
                                        <option value = "fade">Fade</option>
                                    </Input>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup className={margin__bottom__2}>
                            <Row>
                                <Col xs= "4"><Label>Transition Asset</Label></Col>
                                <Col xs= "8"><Input type="text" placeholder="Transition Asset" value = {asset} onChange={handleChangeAsset.bind(this)}/></Col>
                            </Row>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" className = {playlist_save_entry} onClick={()=>handleCreatePlaylist()}>Save</Button>
                        <Button color="warning" className = {playlist_save_entry} onClick={onExitModal} style={{marginLeft:"20px"}}>
                            Cancel
                        </Button>
                    </ModalFooter>                       
                </Modal>
            }
        </div>
    )
}