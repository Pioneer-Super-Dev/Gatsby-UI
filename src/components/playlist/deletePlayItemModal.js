import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export function DeletePlayItemModal({showModal, onExitModal}){
    return(
        <div>
            {
                showModal && 
                <Modal isOpen = {showModal}>
                    <ModalHeader>Confirm</ModalHeader>
                    <ModalBody>
                        Are you really going to delete this item?
                    </ModalBody>
                    <ModalFooter>
                        <Button color = "primary">Delete</Button>
                        <Button color = "warning" onClick = {onExitModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            }
        </div>
    )
}