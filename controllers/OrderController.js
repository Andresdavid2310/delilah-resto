import sequelize from '../database/db';
import detailOrders from '../utils/';
import jwt from 'jsonwebtoken';

export default{
	add: async (req, res) => {
		try {
			const { info_order, payment_method, description  } = req.body;
			const token = req.headers.authorization.split(' ')[1];
			const validatedUser = jwt.verify(token, 'clavesecretaparagenerartoken');
			const dataUser = validatedUser.username;
			let total = 0;
			let product;
	
			const userId = await sequelize.query('SELECT user_id FROM users WHERE username=?', {
				replacements: [dataUser],
				type: sequelize.QueryTypes.SELECT,
			});
	
			const { user_id } = userId[0];
			let i = 0;	
			while(i<info_order.length){

				product =  await sequelize.query('SELECT price, is_enabled,  name_product FROM products WHERE product_id = ?', {  replacements: [info_order[i].product_id],  type: sequelize.QueryTypes.SELECT,  });

				if (product[0].is_enabled !== 0) {
					total += product[0].price*info_order[i].quantity;
				} 
				else {
					res.status(409).json({message: `Error, the product '${product[0].name}' is not available` });
				} 
				
				i++;
			}
							
			await sequelize.query('INSERT INTO orders (user_id, total, status,   payment_method, description) values (?,?,?,?,?)', { 
			replacements: [user_id, total , 'new', payment_method, description],	
			}); 
			
			const response = await sequelize.query( 
			 	'SELECT order_id FROM orders WHERE order_id=(SELECT max(order_id)  FROM orders)', { type: sequelize.QueryTypes.SELECT } 
			); 
	
			info_order.forEach(async (product) => { 
				await sequelize.query('INSERT INTO orders_products (order_id,   product_id, product_amount ) values (?,?,?)', { 
				replacements: [response[0].order_id, product.product_id, product.quantity], 
				}); 
			}); 
			res.status(200).json({message: 'Order created succesfully' });
		} catch (e) {
			res.status(404).json({message: 'Error, product not found' });
		}
	},
	
	list: async (req, res)=> {
		let orders = await sequelize.query(
			`SELECT orders.order_id, orders.user_id, orders.total, orders.status, orders.payment_method, orders.date, users.username, users.name, users.email, users.phone, users.address FROM orders INNER JOIN users ON orders.user_id = users.user_id`,
			{ type: sequelize.QueryTypes.SELECT }
		);
	
		const detailed_orders = await Promise.all(
			orders.map(async (order) => {
				const order_products = await sequelize.query(
					`SELECT * FROM orders_products INNER JOIN products WHERE order_id = ? AND orders_products.product_id = products.product_id`,
					{ replacements: [order.order_id], type: sequelize.QueryTypes.SELECT }
				);
				order.products = order_products;
				return order;
			})
		);
		res.status(200).json({message: 'Sucessful operation', data: detailed_orders });
	},

	query: async (req, res) =>{
		try {
			const orderId = req.params.id;
			const token = req.headers.authorization.split(' ')[1];
			const validatedUser = jwt.verify(token, 'clavesecretaparagenerartoken');
			const dataUser = validatedUser.username;
			const orderUserExist = await sequelize.query('SELECT user_id, order_id FROM orders', {
				type: sequelize.QueryTypes.SELECT,
			});
			const findOrderId = orderUserExist.find((order) => order.order_id == orderId);
	
			if (findOrderId) {
				const userData = await sequelize.query('SELECT users.is_admin, user_id FROM users WHERE username= ? ', {
					replacements: [dataUser],
					type: sequelize.QueryTypes.SELECT,
				});
	
				if (userData[0].is_admin == 1) {
					let orders = await sequelize.query(
						`SELECT orders.order_id, orders.user_id, orders.total, orders.status, orders.payment_method, 
						orders.date, users.username, users.name, users.email, users.phone, users.address 
						FROM orders INNER JOIN users ON orders.user_id = users.user_id WHERE orders.order_id = ${orderId}`,
						{ type: sequelize.QueryTypes.SELECT }
					);
	
					const detailed_orders = await detailOrders.details(orders, orderId);
	
					res.status(200).json({message: 'Successful operation', data: detailed_orders[0] });
				} else {
					const findId = orderUserExist.find((order) => order.user_id == userData[0].user_id);
	
					if (findId) {
						let orders = await sequelize.query(
							`SELECT orders.order_id, orders.user_id, orders.total, orders.status, orders.payment_method, 
							orders.date, users.username, users.name, users.email, users.phone, users.address 
							FROM orders INNER JOIN users ON orders.user_id =users.user_id WHERE orders.order_id = ${orderId} 
							AND orders.user_id =${userData[0].user_id}`,
							{ type: sequelize.QueryTypes.SELECT }
						);
						
						if (!orders[0]) throw new Error();
	
						const detailed_orders = await detailOrders.details(orders, orderId);
	
						res.status(200).json({message: 'Successful operation', data: detailed_orders[0] });
					} else res.status(400).json({message: 'Error,  the user has no order' });
				}
			} else res.status(404).json({message: 'Error,  order not found' });
		} catch (e) {
			res.status(403).json({message: 'Error,  this user cannot see other people´s orders' });
		}
	},

	update: async (req, res) =>{
		try {
			const { status } = req.body;
			const orderId = req.params.id;
			const orderExist = await sequelize.query('SELECT order_id FROM orders', { type: sequelize.QueryTypes.SELECT });
			const findOrderId = orderExist.find((order) => order.order_id == orderId);
	
			if (findOrderId) {
				await sequelize.query('UPDATE orders SET status = ? WHERE order_id = ?', { replacements: [status, orderId] });
				res.status(200).json({ message: 'Successful status change' });
			} else throw new Error('Error , order not found');
		} catch (e) {
			res.status(404).json({ message: e.message });
		}
	},

	remove: async(req, res) => {
		try {
			const orderId = await req.params.id;
			const orderExist = await sequelize.query('SELECT order_id FROM orders', {
				type: sequelize.QueryTypes.SELECT,
			});
			const findOrderId = orderExist.find((order) => order.order_id == orderId);
	
			if (findOrderId) {
				await sequelize.query('DELETE FROM orders_products WHERE order_id = ?', { replacements: [orderId] });
				await sequelize.query('DELETE FROM orders WHERE order_id = ?', { replacements: [orderId] });
				res.status(200).json({message: 'Order deleted' });
			} else throw new Error('Error, not found');
		} catch (e) {
			res.status(404).json({message: e.message });
		}
	}
}