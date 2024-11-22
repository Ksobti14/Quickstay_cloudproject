const express = require('express');
const app = express();
app.use(express.json());
const dbconfig = require('./db');
const roomsroute = require('./routes/Roomroute');
const usersroute = require('./routes/Userroute');
const bookingroute = require('./routes/Bookingroute');
const cors = require('cors');
app.use(cors());

   // Allows all origins by default

// Routes
app.use('/api/rooms', roomsroute);
app.use('/api/users', usersroute);
app.use('/api/bookings', bookingroute);

// Add a route to respond with "Hello from this side"
app.get('/', (req, res) => {
  res.send('Hello from this side');
});

// Port configuration
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
