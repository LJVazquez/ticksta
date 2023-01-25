import dayjs from 'dayjs';

export const ticketStatusEquivalent = {
	OPEN: 'Abierto',
	INPROG: 'En progreso',
	PENDING: 'Pendiente',
	RESOLVED: 'Resuelto',
	CLOSED: 'Cerrado',
};

export const ticketStatusBackgroundColors = {
	OPEN: 'info',
	INPROG: 'warning',
	PENDING: 'danger',
	RESOLVED: 'success',
	CLOSED: 'dark-subtle',
};

export const uriBreadcrumbsEquivalent = {
	'new-ticket': 'Nuevo ticket',
	'ticket-detail': 'Detalle de ticket',
	tickets: 'Tickets',
	dashboard: 'Dashboard',
};

export const formatDate = (date, format = 'DD/MM/YYYY') => {
	return dayjs(date).format(format).toString();
};
