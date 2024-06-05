import { Button, Dialog, DialogBody,DialogFooter, DialogHeader } from '@material-tailwind/react'
import axios from 'axios';
import React, { useState } from 'react'

const DialogNotEnoughtMoney = ({openText,handleOpenText}) => {
   
  return (
    <Dialog open={openText} handler={handleOpenText}>
        <DialogHeader>
          <h1 className='logo-font'>SociableSphere</h1>
        </DialogHeader>
        <DialogBody className="col-12">
          <div className="col-10 flex text-black text-[20px] justify-center items-center">
            You dont have enough money in your wallet please insert more money or see some advertisements.
          </div>
        </DialogBody>
        <DialogFooter className="flex-col-reverse p-3 items-center justify-center">
          <Button
            variant="text"
            color="gray"
            type="button"
            fullWidth
            onClick={handleOpenText}
            className="me-2"
          >
            <span>Accept</span>
          </Button>
        </DialogFooter>
    </Dialog>
  )
}

export default DialogNotEnoughtMoney