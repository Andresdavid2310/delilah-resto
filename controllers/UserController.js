import bcrypt from 'bcryptjs';
import sequelize from '../database/db';
import jwt from 'jsonwebtoken';

export default{
	add: async (req, res) => {
		let { username, name, email, phone, address, password, is_admin } = await req.body;
		if (!is_admin) is_admin = false;
		await sequelize.query(
			'INSERT INTO users (username, name, email, phone, address, password, is_admin ) values (?,?,?,?,?,?,?)',
			{
				replacements: [username, name, email, phone, address, password, is_admin],
			}
		);
		const response = await sequelize.query('SELECT * FROM users WHERE user_id=(SELECT max(user_id) FROM users)', {
			type: sequelize.QueryTypes.SELECT,
		});
		res.status(201).json({ ok: true, message: 'User created successfully in the database', data: response[0] });
	},

	generationToken: async (req, res) => {
		const userData = req.body;
		const token = jwt.sign(userData, 'clavesecretaparagenerartoken');
		return res.status(200).json({ ok: true, token: token, message: 'Successful operation' });
	},

	list: async (req, res) =>{
		const response = await sequelize.query('SELECT * FROM users', { type: sequelize.QueryTypes.SELECT });
		res.status(200).json({ ok: true, message: 'Successful operation', data: response });
	},

	query: async (req, res) => {
		const user_id = await req.params.id;
		const response = await sequelize.query('SELECT * FROM users WHERE user_id = ?', {
			replacements: [user_id],
			type: sequelize.QueryTypes.SELECT,
		});
		res.status(200).json({ ok: true, message: 'Successful operation', data: response[0] 
		});
	},
	
	update: async (req, res) =>{
		try {
			const user_id = await req.params.id;
	
			const { username, name, email, phone, address, password, is_admin } = await req.body;
	
			const response = await sequelize.query('SELECT * FROM users WHERE user_id = ?', {
				replacements: [user_id],
				type: sequelize.QueryTypes.SELECT,
			});
	
			if (username || name || email || phone || address || password || is_admin) {
				Object.assign(response[0], req.body);
	
				const { username, name, email, phone, address, password, is_admin } = response[0];
	
				await sequelize.query(
					`UPDATE users SET username = ?, name = ?, email = ?, phone = ?, 
					address = ?, password = ?, is_admin = ? WHERE user_id = ?`,
					{ replacements: [username, name, email, phone, address, password, is_admin, user_id] }
				);
	
				res.status(200).json({ ok: true, message: 'Successful operation', data: response[0] });
			} else throw new Error('Unexpected error');
		} catch (e) {
			res.status(400).json({ ok: false, message: e.message });
		}
	},

	
	remove: async (req, res) => {
		const user_id = await req.params.id;
		const order_id = await sequelize.query('SELECT order_id FROM orders WHERE  user_id= ? ', { 
			replacements: [user_id],
			type: sequelize.QueryTypes.SELECT,
		});
		order_id.forEach(async (order) => {
			await sequelize.query('DELETE FROM orders_products WHERE order_id = ?', { replacements: [order.order_id] });
		});
		await sequelize.query('DELETE FROM orders WHERE user_id = ?', 
		{ replacements: [user_id] });
		await sequelize.query('DELETE FROM users WHERE user_id = ?', { replacements: [user_id] });
		res.status(200).json({ ok: true, message: 'User was deleted' });
	},

	activate: async (req, res) => {
		try {
			const user_id = await req.params.id;
	
			await sequelize.query(
				`UPDATE users SET is_enabled = true WHERE user_id = ?`,
				{ replacements: [user_id] }
			);
			
			res.status(200).json({ ok: true, message: 'Successful operation'});
			
		} catch (e) {
			res.status(400).json({ ok: false, message: e.message });
		}
	},

	deactivate: async (req, res) => {
		try {
			const user_id = await req.params.id;
	
			await sequelize.query(
				`UPDATE users SET is_enabled = false WHERE user_id = ?`,
				{ replacements: [user_id] }
			);
			
			res.status(200).json({ ok: true, message: 'Successful operation'});
			
		} catch (e) {
			res.status(400).json({ ok: false, message: e.message });
		}
	}
}