import sequelize  from '../database/db';

export default{
	list: async (req, res) =>{
		const response = await sequelize.query('SELECT * FROM products', { type: sequelize.QueryTypes.SELECT });
		res.status(200).json({ ok: true, message: 'Successful operation', data: response });
	},

	add: async (req, res) => {
		let { name_product, description, img_url_product, price, is_enabled } = req.body;
		if (is_enabled == null) is_enabled = true;
		await sequelize.query('INSERT INTO products (name_product, description,  img_url_product, price, is_enabled) values (?,?,?,?,?)', {
			replacements: [name_product, description, img_url_product, price, is_enabled],
		});
		const response = await sequelize.query(
			'SELECT * FROM products WHERE product_id=(SELECT max(product_id) FROM products)',{ type: sequelize.QueryTypes.SELECT }
		);
		res.status(201).json({ ok: true, message: 'Product created successfully', data: response[0] });
	},

	query: async(req, res) =>{
		let product_id = await req.params.id;
		const response = await sequelize.query('SELECT * FROM products WHERE product_id = ?', {
			replacements: [product_id],
			type: sequelize.QueryTypes.SELECT,
		});

		res.status(200).json({ ok: true, message: 'Successful operation', data: response[0] 
		});
	},

	update: async(req, res) => {
		try {
			const product_id = await req.params.id;
			const { name_product, description, img_url_product, price, is_enabled } = await req.body;
			const response = await sequelize.query('SELECT * FROM products WHERE product_id = ?', {
				replacements: [product_id],
				type: sequelize.QueryTypes.SELECT,
			});
	
			if (name_product || description || img_url_product || price || is_enabled) {
				Object.assign(response[0], req.body);
				const { name_product, description, img_url_product, price, is_enabled } = response[0];
				await sequelize.query(
					'UPDATE products SET name_product = ?, description = ?, img_url_product_ = ?, price = ?, is_enabled = ? WHERE product_id = ?',
					{ replacements: [name_product, description, img_url_product, price, is_enabled, product_id] }
				);
				res.status(200).json({ ok: true, message: 'Product update correctly', data: response[0] });
			} else throw new Error('Error validating input data');
		} catch (e) {
			res.status(400).json({ ok: false, message: e.message });
		}
	},

	remove: async (req, res) =>{
		const product_id = await req.params.id;
		await sequelize.query('DELETE FROM orders_products WHERE product_id = ?', { replacements: [product_id] });
		await sequelize.query('DELETE FROM products WHERE product_id = ?', { replacements: [product_id] });	
		res.status(200).json({ ok: true, message: 'Product was delete correctly' });
	},

	activate: async (req, res) => {
		const product_id = await req.params.id;
		await sequelize.query('UPDATE FROM products SET is_enabled = true WHERE product_id = ?', { replacements: [product_id] });
		res.status(200).json({ ok: true, message: 'Product successfully activate' });
	},
	
	deactivate: async (req, res) =>{
		const product_id = await req.params.id;
		await sequelize.query('UPDATE FROM products SET is_enabled = false WHERE product_id = ?', { replacements: [product_id] });
	
		res.status(200).json({ ok: true, message: 'Product successfully deactivate' });
	}
}
