import React from 'react';
import {
	ticketStatusBackgroundColors,
	ticketStatusEquivalent,
} from '../utils/formats';
import { motion } from 'framer-motion';

export default function AmountCard({ name, value }) {
	const borderProps = `border-start border-5 border-${ticketStatusBackgroundColors[name]}`;
	const label = ticketStatusEquivalent[name];

	return (
		<div className="col-6 col-md-2 mb-3">
			<motion.div
				whileHover={{
					scale: 1.05,
				}}
				className={`text-end bg-white rounded-3 px-3 py-1 ${borderProps}`}
			>
				<small className="m-0">{label}</small>
				<h4 className="my-0">{value}</h4>
			</motion.div>
		</div>
	);
}
