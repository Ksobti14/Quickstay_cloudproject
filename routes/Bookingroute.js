const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { v4: uuidv4 } = require('uuid');
const usermodel = require('../models/User');
const stripe = require('stripe')('sk_test_51QMv6eRoxFTfOuPK7SrGjZrJRYZWz3SJ4HFTc10ADFCEP9g03hNvC1Pu4Hpve8CFqIuvIQ8lszkBLiyap682iziK00M1QhLlV8');

// Route to handle room booking
router.post('/bookroom', async (req, res) => {
    const { room, userid, fromdate, todate, totalamount, totaldays, stripeToken } = req.body;

    try {
        // Create a customer on Stripe
        const customer = await stripe.customers.create({
            email: stripeToken.email,
            source: stripeToken.id,
        });

        // Charge the customer
        const payment = await stripe.charges.create(
            {
                amount: totalamount * 100, // Convert to cents
                customer: customer.id,
                currency: 'inr',
                receipt_email: stripeToken.email,
            },
            { idempotencyKey: uuidv4() } // Prevent duplicate charges
        );

        if (payment) {
            try {
                // Save booking details to the database
                const newBooking = new Booking({
                    room: room.name,
                    roomid: room._id,
                    userid,
                    fromdate,
                    todate,
                    totalamount,
                    totaldays,
                    transactionid: payment.id, // Use Stripe payment ID
                });

                const booking = await newBooking.save();
                res.status(200).send('Room booked successfully');
            } catch (error) {
                console.error('Database error:', error);
                res.status(400).json({ message: 'Error saving booking details', error });
            }
        }
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(400).json({ message: 'Payment failed', error });
    }
});
router.post('/getbookingsbyuserid',async(req,res)=>{
    const userid=req.body.userid;
    try {
        const bookings= await Booking.find({userid:userid});
        res.send(bookings)
    } catch (error) {
        return res.status(200).json({error})
    }
});
 // Adjust the path to your booking model

router.delete('/cancelbooking/:id', async (req, res) => {
    try {
        const bookingId = req.params.id;
        await Booking.findByIdAndDelete(bookingId); // Deletes the booking document
        res.status(200).json({ message: 'Booking cancelled successfully.' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Failed to cancel booking.' });
    }
});
router.get('/getallbookings', async (req, res) => {
    console.log("Fetching all bookings");
    try {
        const bookings = await Booking.find();
        res.send(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(400).json({ error });
    }
});

module.exports = router;
