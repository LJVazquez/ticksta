import { useState } from 'react';

export default function NewTicketForm() {
	const [subject, setSubject] = useState('');
	const [date, setDate] = useState('');
	const [description, setDescription] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('subject', subject);
		console.log('date', date);
		console.log('description', description);
		setSubject('');
		setDate('');
		setDescription('');
	};

	return (
		<form className="card p-3" onSubmit={(e) => handleSubmit(e)}>
			<h1>Crear nuevo ticket</h1>
			<div className="mb-3">
				<label htmlFor="subjectInput" className="form-label">
					Tema
				</label>
				<input
					type="text"
					className="form-control"
					id="subjectInput"
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					required
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="dateInput" className="form-label">
					Fecha
				</label>
				<input
					type="date"
					className="form-control"
					id="dateInput"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					required
				/>
			</div>
			<div className="mb-3">
				<div className="form-floating">
					<textarea
						className="form-control"
						id="descriptionField"
						style={{ height: 100 }}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
					<label htmlFor="descriptionField">Descripcion</label>
				</div>
			</div>
			<button type="submit" className="btn btn-primary">
				Crear
			</button>
		</form>
	);
}
