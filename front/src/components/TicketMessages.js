import React from 'react';

export default function TicketMessages({ messages }) {
	return (
		<div className="mb-3">
			{messages.map((message) => (
				<div key={message.id}>
					<div className="mb-2 fw-bold">
						{message.sentBy} - {message.createdAt}
					</div>
					<p className="card p-3 bg-light">{message.body}</p>
				</div>
			))}
		</div>
	);
}
