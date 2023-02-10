const Joi = require('joi');

const validateSchema = (schema, data) => {
	const { error } = schema.validate(data, { abortEarly: false });

	if (error) {
		const errorDetails = error['details'].reduce(
			(acc, detail) => `${acc}${detail.message}\n`,
			''
		);
		return errorDetails;
	}

	return null;
};

const validateUserCreationData = (data) => {
	const userSchema = Joi.object({
		name: Joi.string().min(6).max(30).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).max(30).required(),
		role: Joi.string().valid('USER', 'ADMIN'),
	});

	return validateSchema(userSchema, data);
};

const validateUserUpdateData = (data) => {
	const userSchema = Joi.object({
		name: Joi.string().min(6).max(30),
		email: Joi.string().email(),
		role: Joi.string().valid('USER', 'ADMIN'),
	});

	return validateSchema(userSchema, data);
};

const validateLoginData = (data) => {
	const loginSchema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	});

	return validateSchema(loginSchema, data);
};

const ticketStatuses = ['OPEN', 'INPROG', 'PENDING', 'RESOLVED', 'CLOSED'];
const ticketTypes = ['BUG', 'ISSUE', 'OTHER', 'FEATURE_REQ'];
const ticketPriorities = ['LOW', 'MEDIUM', 'HIGH'];

const validateTicketCreationData = (data) => {
	const ticketSchema = Joi.object({
		subject: Joi.string().min(6).max(100).required(),
		description: Joi.string().min(10).max(300).required(),
		status: Joi.string().valid(...ticketStatuses),
		projectId: Joi.number().integer().required(),
		assignedToId: Joi.number().integer(),
		type: Joi.string()
			.valid(...ticketTypes)
			.required(),
		priority: Joi.string().valid(...ticketPriorities),
	});

	return validateSchema(ticketSchema, data);
};

const validateTicketUpdateData = (data, userRole) => {
	const ticketSchemas = {
		ADMIN: Joi.object({
			subject: Joi.string().min(6).max(100),
			description: Joi.string().min(10).max(300),
			status: Joi.string().valid(...ticketStatuses),
			projectId: Joi.number().integer(),
			assignedToId: Joi.number().integer(),
			type: Joi.string().valid(...ticketTypes),
			priority: Joi.string().valid(...ticketPriorities),
		}),
		DEV: Joi.object({ status: Joi.string().valid(...ticketStatuses) }),
		MANAGER: Joi.object({ assignedToId: Joi.number().integer() }),
	};

	return validateSchema(ticketSchemas[userRole], data);
};

const validateProjectCreationData = (data) => {
	const ticketSchema = Joi.object({
		name: Joi.string().min(6).max(100).required(),
		description: Joi.string().min(10).max(300).required(),
	});

	return validateSchema(ticketSchema, data);
};

const validateProjectUpdateData = (data) => {
	const ticketSchema = Joi.object({
		name: Joi.string().min(6).max(100),
		description: Joi.string().min(10).max(300),
	});

	return validateSchema(ticketSchema, data);
};

const validateTicketMessageCreationData = (data) => {
	const ticketMessageSchema = Joi.object({
		message: Joi.string().min(10).max(300).required(),
		ticketId: Joi.number().integer().required(),
	});

	return validateSchema(ticketMessageSchema, data);
};

module.exports = {
	validateUserCreationData,
	validateUserUpdateData,
	validateLoginData,
	validateTicketCreationData,
	validateTicketUpdateData,
	validateTicketMessageCreationData,
	validateProjectCreationData,
	validateProjectUpdateData,
};
