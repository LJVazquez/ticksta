import dayjs from 'dayjs';

export const ticketStatusEquivalent = {
	OPEN: 'Abierto',
	INPROG: 'En progreso',
	PENDING: 'Pendiente',
	RESOLVED: 'Resuelto',
	CLOSED: 'Cerrado',
};

export const ticketTypesEquivalent = {
	BUG: 'Bug',
	FEATURE_REQ: 'Peticion',
	OTHER: 'Otro',
	ISSUE: 'Problema',
};

export const ticketPrioritiesEquivalent = {
	LOW: 'Baja',
	MEDIUM: 'Media',
	HIGH: 'Alta',
};

export const UserRoleEquivalent = {
	USER: 'Usuario',
	ADMIN: 'Admin',
	MANAGER: 'Manager',
	DEV: 'Desarrollador',
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
