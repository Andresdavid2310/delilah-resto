import sequelize from 'sequelize';
const sequelize = new Sequelize("mysql://root:@localhost:3306/delilah_resto");

// Async/Await Query Tester
(async () => {
	const fetch = await sequelize.query("SELECT * FROM demo", {
		type: sequelize.QueryTypes.SELECT,
	});
	console.log("---- SELECT * FROM demo -----");
	console.log(fetch);
})();


export default sequelize ;


