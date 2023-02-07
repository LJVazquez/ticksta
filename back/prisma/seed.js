const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getIsoDate = (dateStr) => {
	const date = new Date(dateStr);
	return date.toISOString();
};

async function main() {
	const testManager = await prisma.user.upsert({
		where: { email: 'manager@ticksta.com' },
		update: {},
		create: {
			email: 'manager@ticksta.com',
			password: '$2b$10$voK2bcjGJmxot/NACnuLO.vTIy0zjXcdR5W..GJ.6H435/In9hrUG',
			name: 'Test Manager',
			role: 'MANAGER',
			createdProjects: {
				create: [
					{
						id: 1,
						name: 'Reserva catastrofica',
						description:
							'Proyecto derivado de la norma 32312 del consorcio de Seguros de la camara de seguridad Argentina',
						createdAt: getIsoDate('2022-10-20'),
					},
					{
						id: 2,
						name: 'Migracion servidor Kront3 a AWS',
						description:
							'Migracion del servidor principal de la app Kront3 a AWS',
						createdAt: getIsoDate('2022-10-20'),
					},
				],
			},
		},
	});

	const testDev = await prisma.user.upsert({
		where: { email: 'dev@ticksta.com' },
		update: {},
		create: {
			email: 'dev@ticksta.com',
			password: '$2b$10$voK2bcjGJmxot/NACnuLO.vTIy0zjXcdR5W..GJ.6H435/In9hrUG',
			name: 'Test Dev',
			role: 'DEV',
		},
	});

	const testUser = await prisma.user.upsert({
		where: { email: 'user@ticksta.com' },
		update: {},
		create: {
			email: 'user@ticksta.com',
			password: '$2b$10$voK2bcjGJmxot/NACnuLO.vTIy0zjXcdR5W..GJ.6H435/In9hrUG',
			name: 'Test User',
			tickets: {
				create: [
					{
						id: 1,
						subject: 'No puedo acceder a la base de datos',
						description:
							'Al intentar acceder a la aplicacion de pl/sql me sale un mensaje de error que dice "Por favor contacte con el administrador"',
						status: 'OPEN',
						createdAt: getIsoDate('2023-01-21'),
						projectId: 1,
						assignedToId: testDev.id,
						type: 'ISSUE',
					},
					{
						id: 2,
						subject: 'Mis credenciales expiraron',
						description:
							'Al intentar acceder a mi email o a teams me sale un mensaje de credenciales expiradas, y no puedo comunicarme con nadie para actualizarlas. Dejo mi numero de contacto 15-1232-2321',
						status: 'INPROG',
						createdAt: getIsoDate('2023-01-20'),
						projectId: 1,
						assignedToId: testDev.id,
						type: 'ISSUE',
					},
					{
						id: 3,
						subject:
							'Necesito permisos de root para acceder a la base de datos',
						description:
							'Necesito permisos de root para la ruta principal de la aplicacion XT322, si no no puedo conectarme a la base de datos',
						status: 'RESOLVED',
						createdAt: getIsoDate('2023-01-19'),
						projectId: 2,
						type: 'ISSUE',
					},
					{
						id: 4,
						subject: 'Mis credenciales no tienen acceso a teams',
						description:
							'Al intentar acceder a ms teams me sale un mensaje que dice que me comunique con el admin del servicio',
						status: 'CLOSED',
						createdAt: getIsoDate('2022-12-20'),
						projectId: 2,
						type: 'ISSUE',
					},
				],
			},
		},
	});

	const testAdmin = await prisma.user.upsert({
		where: { email: 'admin@ticksta.com' },
		update: {},
		create: {
			email: 'admin@ticksta.com',
			password: '$2b$10$voK2bcjGJmxot/NACnuLO.vTIy0zjXcdR5W..GJ.6H435/In9hrUG',
			name: 'Test Admin',
			role: 'ADMIN',
		},
	});

	const ticketMessages = await prisma.ticketMessage.createMany({
		data: [
			{
				ticketId: 2,
				userId: testAdmin.id,
				message: 'Pareciera un problema masivo, nos comunicamos a la brevedad',
				createdAt: getIsoDate('2023-01-20T15:21'),
			},
			{
				ticketId: 3,
				userId: testAdmin.id,
				message: 'Ya nos comunicamos via teams',
				createdAt: getIsoDate('2023-01-19T10:23'),
			},
			{
				ticketId: 3,
				userId: testUser.id,
				message: 'Aun nadie se comunicó',
				createdAt: getIsoDate('2023-01-19T15:13'),
			},
			{
				ticketId: 3,
				userId: testAdmin.id,
				message: 'Intentamos nuevamente via Whatsapp',
				createdAt: getIsoDate('2023-01-19T16:02'),
			},
			{
				ticketId: 3,
				userId: testAdmin.id,
				message:
					'Marcamos como resuelto, cualquier otra consulta tiene hasta 24 hs antes de cerrar el ticket',
				createdAt: getIsoDate('2023-01-19T17:49'),
			},
			{
				ticketId: 4,
				userId: testAdmin.id,
				message: 'Nos comunicamos a la brevedad a ese numero',
				createdAt: getIsoDate('2022-12-20T11:02'),
			},
			{
				ticketId: 4,
				userId: testUser.id,
				message: 'No recibimos respuesta, volvemos a comunicarnos en breves',
				createdAt: getIsoDate('2022-12-20T11:32'),
			},
		],
	});

	await prisma.project.update({
		where: { id: 1 },
		data: {
			assignedUsers: {
				connect: [{ id: testUser.id }, { id: testDev.id }],
			},
		},
	});

	await prisma.project.update({
		where: { id: 2 },
		data: {
			assignedUsers: {
				connect: { id: testUser.id },
			},
		},
	});

	if (ticketMessages.length > 0) {
		console.info('Seed ok');
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e.message);
		await prisma.$disconnect();
		process.exit(1);
	});
