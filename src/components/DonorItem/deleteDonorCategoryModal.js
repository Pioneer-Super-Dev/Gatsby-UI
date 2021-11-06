import React,  {useState, useEffect} from "react";
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { gql, useMutation, useQuery } from '@apollo/client';
import delay from "delay"

const GET_DONOR = gql`
query MyQuery {
    donors (first: 10000)  {
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

const DELELTE_DONOR = gql`
  mutation DeleteMutation($id: ID!) {
    deleteDonor  ( where: {id: $id}){
      id,
      donorName,
    }
  }
`

const DELETE_CATEGORY = gql`
  mutation deleteCategory($key: String!){
    deleteDonorCategory (where: {donorKey: $key}){
        donorKey
      }
  }
`

export function DeleteDonorCategoryModal({ showModal, onExitModal, donorKey}){
    const [onDeleteHandler] = useMutation(DELELTE_DONOR,
        {
            onCompleted(data){
                setDeleteDonorNum(deleteDonorNum +1);
            }
        });

    const { loading, error, data } = useQuery(GET_DONOR);
    if (error) console.log('error:', error.message);

    const [donorData, setDonorData] = useState([]);
    const [donorChanged, setDonorChanged] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);
    const [deleteDonorNum, setDeleteDonorNum] = useState(0);
    const [deleteDonorStatus, setDeleteDonorStatus] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState();

    if (firstLoad) {
        if (!loading) {
            setFirstLoad(false);
        }
    }

    useEffect(() => {
        if (!loading) {
            const newData = [];
            if (data.length !== 0) {
                let index = 0;
                data.donors.map((item, key) => {
                    // console.log(item);
                    const newItem = { donorId: item.id, donorKey: item.donorKey[0].donorKey };
                    newData.push(newItem);
                    index++;
                })
            }
            setDonorData(newData);
            setDonorChanged(!donorChanged);
        }
    }, [firstLoad])

    const onDelete = async function () {
        setDeleteDonorStatus(true);
        for ( var i = 0; i< donorData.length ; i++){
            if ( donorData[i].donorKey === donorKey){
                onDeleteHandler(
                    {
                        variables: {id: donorData[i].donorId}
                    }
                )
                await delay(100);
            }
        }
        
        onDeleteCategoryHandler({
            variables: {key: donorKey}
        })
        
    }

    const [onDeleteCategoryHandler] = useMutation(DELETE_CATEGORY, {
        onCompleted(data){
            if (data.deleteDonorCategory.donorKey !=="null"){
                setDeleteSuccess(true);
            }else{
                setDeleteSuccess(false);
            }
            setDeleteDonorStatus(false);
        }
    })
    const reload = ()=>{
        window.location.reload();
    }
    return(
        <div>
            {
                showModal && !deleteDonorStatus && !deleteSuccess &&
                <Modal isOpen={showModal} >
                    <ModalHeader>Confirm Message</ModalHeader>
                    <ModalBody>
                    Are you going to this Donor Category? <br/>
                    All the Donor items with this Donor Category will be removed. <br/> Is it Okay with you?
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={onDelete}>Yes, Delete All!</Button>{' '}
                    <Button color="secondary" onClick={onExitModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            }
            {
                showModal && deleteDonorStatus &&
                <Modal isOpen={showModal} >
                    <ModalHeader >Deleting Donors....</ModalHeader>
                    <ModalBody>
                    Now deleting donors having the current donor key <br/>
                    Deleted donors. {deleteDonorNum}
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </Modal>
            }
            {
                showModal && deleteSuccess &&
                <Modal isOpen={showModal} >
                    <ModalHeader>Delete Success</ModalHeader>
                    <ModalBody>
                    {deleteDonorNum} donor items are deleted!
                    <br/> One donor category is deleted.
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={reload}>Reload!</Button>{' '}
                    </ModalFooter>
                </Modal>
            }
            {/* {
                showModal && !deleteSuccess &&
                <Modal isOpen={showModal} >
                    <ModalHeader>Delete Faliure!</ModalHeader>
                    <ModalBody>
                    Error occured
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={reload}>Reload!</Button>{' '}
                    </ModalFooter>
                </Modal>
            } */}
        </div>
    )
}