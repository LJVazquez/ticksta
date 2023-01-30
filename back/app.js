require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const app = express();
const PORT = 3001;
const apiRoute = '/api/v1';

const userRouter = require('./routes/User.js');
const ticketRouter = require('./routes/Ticket.js');
const ticketMessageRouter = require('./routes/TicketMessage.js');
const authRouter = require('./routes/Auth.js');
const { authorizeUser } = require('./middleware/authMiddleware');

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

app.use(`${apiRoute}/users`, userRouter);
app.use(`${apiRoute}/tickets`, authorizeUser, ticketRouter);
app.use(`${apiRoute}/ticketmessages`, authorizeUser, ticketMessageRouter);
app.use(`${apiRoute}/auth`, authRouter);

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use('*', (req, res) => {
	res.status(404).send('ruta invalida');
});

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
