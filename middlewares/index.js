import sequelize  from '../database/db';
import jwt from 'jsonwebtoken';

export default{

	validateData: async (req, res, next) =>{
		try {
			if (req.path == '/add') {
	
				const { username, name, email, phone, address, password } = await req.body;
				console.log(username, name, email, phone, address, password);
	
				if (username && name && email && phone && address && password) {
					const response = await sequelize.query('SELECT users.email, users.username FROM users', {
						type: sequelize.QueryTypes.SELECT,
					});
	
					const userRepeated = response.find((user) => user.email == email || user.username == username);
	
					if (userRepeated !== undefined) throw new Error('Error, Previously registered user');
					else return next();
				} else throw new Error('Error, missing data');
			}
	
			if (req.path == '/products') {
				const { name_product, description, img_url_product, price } = await req.body;
	
				if (name_product && description && img_url_product && price) {
					const response = await sequelize.query('SELECT products.name_product, products.description FROM products', {
						type: sequelize.QueryTypes.SELECT,
					});
	
					const productRepeated = response.find((product) => product.name_product == name_product || product.description == description);
	
					if (productRepeated !== undefined) throw new Error('Error, Previously registered product');
					else return next();
				} else throw new Error('Error, missing data');
			}
		} catch (e) {
			if (e.message === 'Error, missing data') return res.status(400).json({ ok: false, message: e.message });
			else return res.status(409).json({ ok: false, message: e.message });
		}
	},
	
	valideUserExits: async (req, res, next) => {
		try {
			const { username, email } = await req.body;
	
			const response = await sequelize.query('SELECT users.email, users.username FROM users', {
				type: sequelize.QueryTypes.SELECT,
			});
	
			const userRepeated = response.find((user) => user.email == email || user.username == username);
			console.log(userRepeated);
			if (userRepeated !== undefined) return next();
			else throw new Error('Error, Previously registered user'); 
		} catch (e) {
			if (e.message === 'Error, missing data') return res.status(400).json({ ok: false, message: e.message });
			else return res.status(409).json({ ok: false, message: e.message });
		}
	},
	
	loginUser: async (req, res, next) => {
		try {
			const { username, password } = await req.body;
			const responseData = await sequelize.query('SELECT users.username, users.password FROM users', {
				type: sequelize.QueryTypes.SELECT,
			});
	
			const registered = responseData.find((user) => user.username == username && user.password == password);
	
			if (registered !== undefined) return next();
			else throw new Error('Error, Incorrect credentials');
		} catch (e) {
			return res.status(401).json({ ok: false, message: e.message });
		}
	},

	/* validateJwt: async (req, res, next) =>{ */
	/* 	try { */
	/* 		if (req.path !== '/add' && req.path !== '/login') { */
	/* 			const token = req.headers.authorization.split(' ')[1]; */
	/* 			const verifyToken = jwt.verify(token, 'clavesecretaparagenerartoken') *//* ; */
	/* 	 */
	/* 			if (verifyToken) { */
	/* 				req.token = verifyToken; */
	/* 				console.log(req.token) */
	/* 				return next(); */
	/* 			} */
	/* 		} else return next(); */
	/* 	} catch (e) { */
	/* 		return res.status(401).json({ ok: false, message: 'Error, Invalid Token' } *//* ); */
	/* 	} */
	/* }, */

	validateAdmin: async (req, res, next) => {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const validatedUser = jwt.verify(token, 'clavesecretaparagenerartoken');
			const dataUser = validatedUser.username;
			const adminData = await sequelize.query('SELECT users.is_admin FROM users 	WHERE  username= ? ', { 
			replacements: [dataUser],
			type: sequelize.QueryTypes.SELECT,});
	
			if (adminData[0].is_admin == 1) next();
			else throw new Error('Error, only an admin user can do this');

		} catch (e) {
			if (e.message === 'Error, only an admin user can do this')
			return res.status(403).json({ ok: false, message: e.message });
			return res
			.status(409)
	 		.json({ ok: false, message: 'Error, you cannot perform this action   because you aren´t registered' });
		}
	},

	validateIdProduct: async (req, res, next) => {
		try {
			const product_id = req.params.id;
			const response = await sequelize.query('SELECT product_id FROM products', { type: sequelize.QueryTypes.SELECT });
			const exist = response.find((id) => id.product_id == product_id);
	
			if (exist) return next();
			else throw new Error('Error, not found');
		} catch (e) {
			return res.status(404).json({ ok: false, message: e.message });
		}
	},

	validateIdUser: async (req, res, next) => {
		try {
			const user_id = await req.params.id;
			const response = await sequelize.query('SELECT user_id FROM users', { type: sequelize.QueryTypes.SELECT });
			const exist = response.find((id) => id.user_id == user_id);
	
			if (exist) return next();
			else throw new Error('Error, not found');
		} catch (e) {
			return res.status(404).json({ ok: false, message: e.message });
		}
	},
	
	validateDataOrder: async (req, res, next) => {
		try {
			const { payment_method, info_order } = req.body;
	
			if (payment_method && info_order) {
				if (payment_method == 'cash' || payment_method == 'card') {
					info_order.forEach((order) => {
						if (!order.product_id || !order.quantity) throw new Error('Error, missing data');
					});
					return next();
				} else throw new Error('Error, invalid payment method');
			} else throw new Error('Error, missing data');
		} catch (e) {
			if (e.message === 'Error, missing data') return res.status(400).json({ ok: false, message: e.message });
			else return res.status(403).json({ ok: false, message: e.message });
		}
	},
	
	validateOrderStatus: async (req, res, next) =>{
		try {
			const { status } = req.body;
	
			if (status) {
				if (
					status == 'confirmed' ||
					status == 'preparing' ||
					status == 'sending' ||
					status == 'cancelled' ||
					status == 'delivered' ||
					status == 'new'
				)
					next();
				else throw new Error('Error, Input invalid');
			} else throw new Error('Error, Input invalid');
		} catch (e) {
			res.status(400).json({ ok: false, message: e.message });
		}
	},
	
	error: async (err, res, next) => {
		if (!err) return next();
		res.status(500).send('Error, something was wrong');
	}
}
