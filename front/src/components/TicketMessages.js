import { formatDate } from '../utils/formats';

const getSkeleton = () => {
	const messages = [];

	for (let i = 0; i < 2; i++) {
		messages.push(
			<div key={i}>
				<div className="mb-2 fw-bold">User</div>
				<p className="card p-2 placeholder-glow d-flex">
					<span className="placeholder w-100 mb-2"></span>
					<span className="placeholder w-75"></span>
				</p>
			</div>
		);
	}

	return messages;
};

export default function TicketMessages({ messages }) {
	if (messages) {
		return (
			<div className="mb-3">
				{messages.length > 0 ? (
					messages.map((message) => {
						const createdAt = formatDate(message.createdAt, 'DD/MM/YYYY HH:mm');
						return (
							<div key={message.id}>
								<div className="mb-2 fw-bold">
									{message.user.name} ({createdAt}):
								</div>
								<p className="card p-3 bg-white">{message.message}</p>
							</div>
						);
					})
				) : (
					<div className="mb-2 fw-bold">Sin mensajes</div>
				)}
			</div>
		);
	} else {
		return getSkeleton();
	}
}
