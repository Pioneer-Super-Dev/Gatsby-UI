import React, { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from '@apollo/client';

import Header from "../header";
import {
    main__view, part__screen__container, part__screen__with__refresh, part__screen__refresh__button,
    part__screen__refresh__button__container, icon
} from '../../pages/style.module.css';
import SidebarContent from "../sidebarContent";

import {
    donors__edit__title__box, donors__edit__list__title, saveButton, deleteButton, donors__edit__add__donor,
    donors__edit__add__name, donors__edit__add__letter
} from '../../pages/donoritem.module.css';

import { users__edit__table } from '../../pages/user.module.css';
import DeleteModal from "../deleteModal";
import { AddDonorButton } from "./addDonorButton";

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import { Row, Col, Alert,  Modal, ModalHeader, ModalBody, ModalFooter , Button } from "reactstrap";
import cellEditFactory from 'react-bootstrap-table2-editor';
import delay from "delay";
import Papa from 'papaparse';

import { AddDonorListModal } from "./addDonorListModal";
const client1 = new ApolloClient({
    uri: "https://api-us-east-1.graphcms.com/v2/ckso8s3um1hfq01y25hh4h6ri/master",
    cache: new InMemoryCache(),
});

const GET_DONOR = gql`
query MyQuery {
    donors (first: 1000000)  {
      id,
      donorName,
      donorOrder,
      letter
      donorKey{
          donorKey,
          donorCategoryTitle
      }
    }
}
`

const UPDATE_DONOR = gql`
  mutation updateMutation($id: ID!, $donorName: String!, $letter: String!){
    updateDonor (
      where:{id: $id},
      data: {donorName:$donorName, letter: $letter})
    {
      id,
      donorName,
      donorOrder,
      letter,
    }
}
`
const UPDATE_TITLE_CATEGORY = gql`
    mutation updateTitle($donorKey: String!, $newValue: String!){
        updateDonorCategory(
            where: {donorKey: $donorKey},
            data: {donorCategoryTitle: $newValue}
        )
        {
            donorKey,
            author
        }
    }
`

const PUBLISH_TITLE_CATEGORY = gql`
    mutation publishTitle($donorKey: String!){
        publishDonorCategory(
            where: {donorKey: $donorKey}
        )
        {
            donorKey,
            author
        }
    }
`

const PUBLISH_DONOR = gql`
    mutation publishMutation($id: ID!) {
        publishDonor (where: {id : $id}){
            id,
            donorName,
             donorOrder,
            letter,
        }
    }
`

const DELELTE_DONOR = gql`
  mutation DeleteMutation($id: ID!) {
    deleteDonor  ( where: {id: $id}){
      id,
      donorName,
      donorOrder,
      letter,
    }
  }
`
const tableCols =
    [
        {
            dataField: "name",
            text: "Donor Name",
            sort: true,
            searchable: true
        },
        {
            dataField: "letter",
            text: "Donor Letter",
            sort: true,
            searchable: true
        }
]

const pagination = paginationFactory({
    sizePerPageList:
        [{
            text: '10', value: 10
        },{
            text: '20', value: 20
        },{
            text: '30', value: 30
        },{
            text: '40', value: 40
        },{
            text: '50', value: 50
        }]
})
const { ExportCSVButton } = CSVExport;

export function DonorItemPageComponent(selectedDonorKey) {

    const [editTitle, setEditTitle] = useState(false);
    const [selectedTitleBox, setSeletectedTitleBox] = useState('');
    const [originalTitle, setOriginalTitle] = useState('');

    const [createSuccess, setCreateSuccess] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [newLetter, setNewLetter] = useState('');
    const [newName, setNewName] = useState('');
    const [selectedItemIdToDelete, setSeletectedItemIDToDelete] = useState([]);
    const [selectedItemIDToPublish, setSeletectedItemIDToPublish] = useState('none');

    const [newData, setNewData] = useState([])
    const [showNewModal, setShowNewModal] = useState(false);
    const inputFileRef = React.useRef();
    const onFilechange = (e) => {
        /*Selected files data can be collected here.*/
        const reader = new FileReader()
        reader.onload = async (e) => { 
            const text = (e.target.result)
            const result = Papa.parse(text);
            if ( result.data[0][1]=== 'donorKey' && result.data[0][2] === 'donorName' && result.data[0][3] === 'letter'){
                
                // var today = new Date().toISOString();
                const newData = [];
                let index = 0;
                for ( var i = 1 ; i< result.data.length-1; i++){
                    const newItem = {id: index,  donorKey: result.data[i][1], donorName: result.data[i][2], letter: result.data[i][3]}
                    newData.push(newItem);
                    index++;
                }
                setNewData(newData);
                setShowNewModal(true);
                document.querySelector(".user-module--users__edit__table---YKAv .active.page-item .page-link").style.zIndex = 0;
            }
        };
       reader.readAsBinaryString(e.target.files[0])
    }

    const { loading, error, data } = useQuery(GET_DONOR);
    if (error) console.log('error:', error.message);

    const [onPublishHander] = useMutation(PUBLISH_DONOR,
        {
            onCompleted(data) {
                console.log("d", data);
                // reloadPage();
                setStatusMessage("The item is updated successfully.")
            }
        })
    const [onUpdateHander] = useMutation(UPDATE_DONOR,
        {
            onCompleted(data) {
                console.log("Result: ", data);
                setSeletectedItemIDToPublish(data.updateDonor.id)
            }
        })

    const [onUpdateTitleCategory] = useMutation(UPDATE_TITLE_CATEGORY,
        {
            onCompleted() {
                onPublishTitleCategory({
                    variables: { donorKey: selectedDonorKey.selectedDonorKey }
                });
            }
        })
    const [onPublishTitleCategory] = useMutation(PUBLISH_TITLE_CATEGORY,
        {
            onCompleted() {
                window.location = "/donorlist";
            }
        })

    const [onDeleteHandler] = useMutation(DELELTE_DONOR, 
        {
            onCompleted(data){
                // window.location.reload();
            }
        }
    );

    const [donorData, setDonorData] = useState([]);
    const [donorChanged, setDonorChanged] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);
    const [statusMessage, setStatusMessage] = useState("This is Donor List. If you want to edit item, please double click the cell of table and click elsewhere to save. And please click on the row to delete.")
    const [deleteModal, setDeleteModal] = useState(false);
    const [resultModal, setResultModal] = useState(false);
    const [donorCategory, setDonorCategory] = useState([]);

    if (firstLoad) {
        if (!loading) {
            setFirstLoad(false);
        }
    }

    useEffect(() => {
        if (!loading) {
            const newData = [];
            const category = [];
            category.push({donorKey:selectedDonorKey.selectedDonorKey});

            if (data.length !== 0) {
                let index = 0;
                data.donors.map((item, key) => {
                    if (item.donorKey[0].donorKey === selectedDonorKey.selectedDonorKey) {
                        setSeletectedTitleBox(item.donorKey[0].donorCategoryTitle);
                        setOriginalTitle(item.donorKey[0].donorCategoryTitle);
                        let nameItem, letterItem;
                        nameItem = item.donorName;
                        letterItem = item.letter;

                        const newItem = { id: index, donorId: item.id, name: nameItem, letter: letterItem };
                        newData.push(newItem);
                        index++;
                    }
                    else{
                        if (!category.includes(item.donorKey[0].donorKey))
                            category.push(item.donorKey[0].donorKey)
                    }
                })
            }
            console.log("result: ", category);
            setDonorData(newData);
            setDonorCategory(category);
            setDonorChanged(!donorChanged);
        }
    }, [firstLoad])

    const onEditButton = () => {
        setEditTitle(true);
    }

    const onSaveButton = () => {
        setEditTitle(false);
        if (originalTitle !== selectedTitleBox) {
            onUpdateTitleCategory({
                variables: { donorKey: selectedDonorKey.selectedDonorKey, newValue: selectedTitleBox }
            })
        }
    }

    const onExitModalButton = () => {
        setShowModal(false);
    }

    const onDeleteButton = () => {
        setShowModal(true);
    }
    useEffect(() => {
        if (selectedItemIDToPublish !== 'none') {
            onPublishHander({
                variables: {
                    id: selectedItemIDToPublish
                }
            })
        }

    }, [selectedItemIDToPublish])
    const handleSeletecTitle = e => {
        setSeletectedTitleBox(e.target.value);
    }
    const handleNewName = e => {
        setNewName(e.target.value)
    }
    const handleNewLetter = e => {
        setNewLetter(e.target.value);
    }
    const reloadPage = () => {
        window.location.reload();
    }

    function EditButton() {
        if (editTitle) {
            return (
                <button className={saveButton} onClick={() => { onSaveButton() }}></button>
            )
        }
        else {
            return (
                <button onClick={() => { onEditButton() }}></button>
            )

        }
    }

    const handleCreateSuccess = e => {
        window.location.reload();
    }

    const handleCreateFinish = e => {
        setCreateSuccess(false);
    }

    const onAfterSave = (oldValue, newValue, row) => {
        if ( oldValue != newValue){
            const data = donorData;
            let name, letter;
            data.map((item, key) => {
                if (item.donorId === row.donorId) {
                    name = item.name;
                    letter = item.letter;
                    console.log("row", row, item);
                    try {
                        onUpdateHander({
                            variables: { id: item.donorId, donorName: name, letter: letter }
                        });
                    }
                    catch (e) {
                        console.log(e);
                        setStatusMessage("Failure, please retry later!")
                    }
                }
            })
        }
    }
    const MySearch = (props) => {
        let input;
        const handleClick = () => {
            props.onSearch(input.value);
        };
        return (
            <Row>
                <Col xs="9">
                    <input
                        className="form-control"
                        style={{ backgroundColor: '#FFFEF7' }}
                        ref={n => input = n}
                        type="text"
                    />
                </Col>
                <Col xs="3">
                    <button className="btn btn-primary" onClick={handleClick}>Search</button>
                </Col>
            </Row>
        );
    };
    const onSelect = (row, isSelect)=>{
        
        if (isSelect) {
            const ids = selectedItemIdToDelete;
            ids.push({"donorId":row.donorId});
            setSeletectedItemIDToDelete(ids);
        }
        if(!isSelect){
            const temp = []
            // const id = 
            const ids = selectedItemIdToDelete;
            // console.log(ids);
            setSeletectedItemIDToDelete([])
            ids.map((item, key)=>{
                if (item.donorId != row.donorId){
                    // console.log(item.donorId, row.donorId)
                    temp.push({"donorId": item.donorId})
                }
            })
            setSeletectedItemIDToDelete(temp)
        }
    }
    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        clickToEdit: true ,
        onSelect: onSelect
    };
    const deleteDonors = () =>{
        try{
            const temp = donorData;
            selectedItemIdToDelete.map((item1, key) =>{
                onDeleteHandler({
                    variables: {id:item1.donorId}
                })
                delay(100);
            })
            temp.map((item, key)=>{
                var flag = true;
                selectedItemIdToDelete.map((item1, key) =>{
                    if ( item.donorId == item1.donorId)
                        flag = false
                })
                if (flag)
                    temp.push({ id: item.id, donorId: item.donorId, name: item.name, letter: item.letter })
            })
            setStatusMessage(selectedItemIdToDelete.length + " donor items are deleted! ")
            
        }
        catch(e){
            setStatusMessage("Failure, please try later!")
        }
        setResultModal(true);
    }

    const showDeleteModal = () =>{
        console.log("00")
        setDeleteModal(true);
    }
    const hideModal = () =>{
        setDeleteModal(false)
    }
    function onPClick() {
        inputFileRef.current.click();
    }

    const onExitNewModalButton = () =>{
        setShowNewModal(false);
        setNewData([]);
    }

    const exportCSVSetting = {
        fileName: selectedDonorKey.selectedDonorKey + ".csv"
    }
    return (
        <div>
            <Header />
            <div className={main__view}>
                <SidebarContent case="denors">
                </SidebarContent>
                <div className={part__screen__container}>
                    <div className={donors__edit__list__title}>
                        <div className={donors__edit__title__box}>
                            {
                                editTitle ?
                                    <input type="text" value={selectedTitleBox} onChange={(e) => handleSeletecTitle(e)} />
                                    : <div>{selectedTitleBox}</div>
                            }
                        </div>
                        <EditButton />
                        <button className={deleteButton} onClick={() => onDeleteButton()}></button>
                    </div>
                    <div className={part__screen__with__refresh}>
                        <div className={part__screen__refresh__button__container}>
                            <Button color="danger" onClick = {() => showDeleteModal()}>Delete Selected Donors</Button>
                            <Button color="info" style = {{marginLeft: "2em"}} onClick={() => reloadPage()}>Refresh Donors</Button>
                            <Button color="primary" style = {{marginLeft: "2em", display: "flex", flexDirection: "row"}} onClick = {()=> onPClick()} >
                                <div className={icon} style = {{marginRight: "5px", marginTop:"3px"}}></div>
                                <input type="file" ref={inputFileRef} onChange={onFilechange} style={{ display: 'none' }} accept = ".csv"/>Upload CSV
                            </Button>
                        </div>
                        <div className={donors__edit__add__donor}>
                            <input className={donors__edit__add__name} type="text" value={newName} onChange={handleNewName.bind(this)} placeholder="Name" required />
                            <input className={donors__edit__add__letter} type="text" value={newLetter} onChange={handleNewLetter.bind(this)} placeholder="Letter" required />
                            <ApolloProvider client={client1}>
                                <AddDonorButton donorName={newName} letter={newLetter} createSuccess={handleCreateSuccess.bind(this)} createFinish={handleCreateFinish.bind(this)}
                                    selectedDonorKey={selectedDonorKey.selectedDonorKey} />
                            </ApolloProvider>
                        </div>
                    </div>
                    <div className={users__edit__table}>
                        {
                        donorData &&
                            <ToolkitProvider
                                keyField="id"
                                data={donorData}
                                columns={tableCols}
                                exportCSV = { exportCSVSetting}
                                search >
                                {
                                    props => (
                                        <div>
                                            <hr />
                                            <Alert color="success">
                                                <p>{statusMessage}</p>
                                            </Alert>
                                            <Row>
                                                <Col xs="10">
                                                    <MySearch {...props.searchProps} />
                                                </Col>
                                                <Col xs="2">
                                                    <ExportCSVButton {...props.csvProps} className="btn btn-success" >Export CSV</ExportCSVButton>
                                                </Col>
                                            </Row>
                                            <hr />
                                            <BootstrapTable
                                                pagination={pagination}
                                                cellEdit={cellEditFactory({
                                                    mode: 'dbclick',
                                                    blurToSave: true,
                                                    afterSaveCell: (oldValue, newValue, row, column) => onAfterSave(oldValue, newValue, row, column)
                                                })}
                                                selectRow={selectRow}
                                                {...props.baseProps}
                                            />
                                        </div>
                                    )
                                }
                            </ToolkitProvider>
                        }
                    </div>
                </div>
                <ApolloProvider client={client1}>
                    <DeleteModal showModal={showModal} onExitModal={() => onExitModalButton.bind(this)}
                        selectedDonorKey={selectedDonorKey.selectedDonorKey} ></DeleteModal>
                </ApolloProvider>
                
                <Modal isOpen={deleteModal} toggle={showDeleteModal}>
                    <ModalHeader toggle={hideModal}>Are you sure to delete seleted items?</ModalHeader>
                    <ModalBody>
                        {
                            selectedItemIdToDelete.length ==0 &&(
                                "Please select the items to delete!"
                            )
                        }
                        {
                            selectedItemIdToDelete.length >0 &&(
                                "Are you sure to delete " + selectedItemIdToDelete.length + " items?"
                            )
                        }
                    </ModalBody>
                    <ModalFooter>
                    {
                        selectedItemIdToDelete.length >0 &&(
                            <Button color="primary" onClick={ ()=>deleteDonors()}>Yes</Button>
                        )
                    }
                    <Button color="secondary" onClick={()=>hideModal()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                    
                <Modal backdrop = "false" isOpen = {resultModal}>
                    <ModalHeader>Result: </ModalHeader>
                    <ModalBody>
                        {statusMessage}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={ ()=>reloadPage()}>Yes</Button>
                    </ModalFooter>
                </Modal>
                
                <AddDonorListModal showModal = {showNewModal} onExitModal = {() =>onExitNewModalButton.bind(this)} newData = {newData} mode= "item"
                donorCategory = {donorCategory} selectedDonorKey = {selectedDonorKey.selectedDonorKey}
                />
            </div>
        </div>
    )
}