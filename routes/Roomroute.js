const express=require('express');
const router=express.Router();
const Room=require('../models/Room')
router.post('/addroom', async (req, res) => {

    try {
        const newRoom = new Room(req.body);

        await newRoom.save();
        res.status(200).send('Room added successfully!');
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
router.get('/getallrooms', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms); 
    } catch (error) {
        res.status(400).json({ message: error.message }); 
    }
});
router.post('/getroombyid', async (req, res) => {
    const roomid=req.body.roomid
    try {
        const room = await Room.findOne({_id:roomid});
        res.status(200).json(room); 
    } catch (error) {
        res.status(400).json({ message: error.message }); 
    }
});
module.exports=router;