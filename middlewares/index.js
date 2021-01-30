import sequelize  from '../database/db';
import jwt from 'jsonwebtoken';

export default{

	validateData: async (req, res, next) =>{
		try {
			const { username, name, email, phone, address, password } = await req.body;
	
			if (username && name && email && phone && address && password) {
				const response = await sequelize.query('SELECT users.email, users.username FROM users', {
					type: sequelize.QueryTypes.SELECT,
				});
	
				const userRepeated = response.find((user) => user.email == email || user.username == username);
	
				if (userRepeated !== undefined) throw new Error('The user is already registered');
				else return next();
			} else throw new Error('Error validating input data');
		} catch (e) {
			if (e.message === 'Error validating input data') return res.status(400).json({message: e.message });
			else return res.status(409).json({ message: e.message });
		}
	},

	validateProduct : async (req,res, next) =>{
		try{
			const { name_product, description, img_url_product, price } = await req.body;
			if (name_product && description && img_url_product && price) {
				const response = await sequelize.query('SELECT products.name_product, products.description FROM products', {
					type: sequelize.QueryTypes.SELECT,
				});
				const productRepeated = response.find((product) => product.name_product == name_product || product.description == description);
				if (productRepeated !== undefined) throw new Error('The product is already registered');
				else return next();
			} else throw new Error('Error validating input data');
		} catch (e) {
			if (e.message === 'Error validating input data') return res.status(400).json({message: e.message });
			else return res.status(409).json({ message: e.message });
		}
	},

	validateUserExits: async (req, res, next) => {
		try {
			const { username, email } = await req.body;
	
			const response = await sequelize.query('SELECT users.email, users.username FROM users', {
				type: sequelize.QueryTypes.SELECT,
			});
	
			const userRepeated = response.find((user) => user.email == email || user.username == username);
			if (userRepeated !== undefined) return next();
			else throw new Error('User is not registered'); 
		} catch (e) {
			if (e.message === 'Error validating input data') return res.status(400).json({message: e.message });
			else return res.status(409).json({message: e.message });
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
			else throw new Error('Invalid Username/password');
		} catch (e) {
			return res.status(401).json({message: e.message });
		}
	},

	validateAdmin: async (req, res, next) => {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const validatedUser = jwt.verify(token, 'clavesecretaparagenerartoken');
			const dataUser = validatedUser.username;
			const adminData = await sequelize.query('SELECT users.is_admin FROM users 	WHERE  username= ? ', { 
			replacements: [dataUser],
			type: sequelize.QueryTypes.SELECT,});
	
			if (adminData[0].is_admin == 1) next();
			else throw new Error('Operation not allowed, user is not admin');

		} catch (e) {
			if (e.message === 'Operation not allowed, user is not admin')
			return res.status(403).json({message: e.message });
			return res
			.status(409)
	 		.json({message: 'Error, you cannot perform this action  because you aren´t registered' });
		}
	},

	validateIdProduct: async (req, res, next) => {
		try {
			const product_id = req.params.id;
			const response = await sequelize.query('SELECT product_id FROM products', { type: sequelize.QueryTypes.SELECT });
			const exist = response.find((id) => id.product_id == product_id);
	
			if (exist) return next();
			else throw new Error('The specified resource was not found');
		} catch (e) {
			return res.status(404).json({message: e.message });
		}
	},

	validateIdUser: async (req, res, next) => {
		try {
			const user_id = await req.params.id;
			const response = await sequelize.query('SELECT user_id FROM users', { type: sequelize.QueryTypes.SELECT });
			const exist = response.find((id) => id.user_id == user_id);
	
			if (exist) return next();
			else throw new Error('The specified resource was not found');
		} catch (e) {
			return res.status(404).json({message: e.message });
		}
	},
	
	validateDataOrder: async (req, res, next) => {
		try {
			const { payment_method, info_order } = req.body;
	
			if (payment_method && info_order) {
				if (payment_method == 'cash' || payment_method == 'card') {
					info_order.forEach((order) => {
						if (!order.product_id || !order.quantity) throw new Error('Error validating input data');
					});
					return next();
				} else throw new Error('Error invalid payment method');
			} else throw new Error('Error validating input data');
		} catch (e) {
			if (e.message === 'Error validating input data') return res.status(400).json({ message: e.message });
			else return res.status(403).json({message: e.message });
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
				else throw new Error('Error, validating data');
			} else throw new Error('Error, validating data');
		} catch (e) {
			res.status(400).json({message: e.message });
		}
	},
	
	error: async (err, res, next) => {
		if (!err) return next();
		res.status(500).send('An error occurred');
	}
}
