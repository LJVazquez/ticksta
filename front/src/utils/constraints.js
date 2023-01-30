export const newTicketConstraints = {
	subject: {
		required: 'Por favor ingrese un tema',
		minLength: {
			value: 10,
			message: 'Por favor describa el tema, minimo 10 caracteres',
		},
		maxLength: {
			value: 100,
			message: 'Maximo 100 caracteres',
		},
	},
	description: {
		required: 'Por favor escriba una descripcion',
		minLength: {
			value: 10,
			message:
				'Por favor escriba una descripcion detallada, minimo 10 caracteres',
		},
		maxLength: {
			value: 300,
			message: 'Maximo 300 caracteres',
		},
	},
};

export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const loginInputConstraints = {
	email: {
		required: 'Por favor ingrese su email',
		pattern: {
			value: emailRegex,
			message: 'Email invalido',
		},
	},
	password: {
		required: 'Por favor ingrese su contraseña',
	},
};

export const registerInputConstraints = {
	name: {
		required: 'Por favor ingrese un nombre',
		minLength: { value: 6, message: 'Minimo 6 caracteres' },
		maxLength: { value: 30, message: 'Minimo 30 caracteres' },
	},
	email: {
		required: 'Por favor ingrese un email',
		pattern: {
			value: emailRegex,
			message: 'Email invalido',
		},
	},
	password: {
		required: 'Por favor ingrese una contraseña',
		minLength: { value: 6, message: 'Minimo 6 caracteres' },
		maxLength: { value: 30, message: 'Minimo 30 caracteres' },
	},
};

export const newMessageConstraint = {
	required: 'Por favor escriba una respuesta',
	minLength: {
		value: 10,
		message:
			'Por favor escriba una descripcion detallada, minimo 10 caracteres',
	},
	maxLength: {
		value: 300,
		message: 'Maximo 300 caracteres',
	},
};
