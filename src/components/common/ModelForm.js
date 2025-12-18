import React from 'react';
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import Box from '@mui/material/Box';

const ModalForm = ({ open, onClose, children }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent><Box sx={{ width: '384px' }}>
        {children}
      </Box></DialogContent>
      <DialogActions>
        <Box sx={{ width: '384px' }}>

        </Box>
        {/* <Button onClick={onClose}>Cancel</Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default ModalForm;