require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const PORT = 3001;

const userRouter = require('./routes/User.js');
const ticketRouter = require('./routes/Ticket.js');
const authRouter = require('./routes/Auth.js');
const { authorizeUser } = require('./middleware/authMiddleware');

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

app.use('/users', authorizeUser, userRouter);
app.use('/tickets', authorizeUser, ticketRouter);
app.use('/auth', authRouter);

app.use('*', (req, res) => {
	res.status(404).send('ruta invalida');
});

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
