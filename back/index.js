const PORT = 3001;
const app = require('./app');

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
