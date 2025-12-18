/* This is implementation of test cases for delete Dialog box for common component. 
  Author : Arpana Meshram   
*/
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

const DialogBox = ({ open, onClose, onDelete, itemToDelete }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete {itemToDelete}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} id='backBtn' style={{ color: 'black' }}>
          Cancel
        </Button>
        <Button onClick={onDelete} style={{ backgroundColor: 'red', color: 'white' }} autoFocus id='nextBtn'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;