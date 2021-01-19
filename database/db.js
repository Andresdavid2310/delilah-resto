
import Sequelize from 'sequelize';

const sequelize = new Sequelize('mysql://root:@localhost:3306/delilah_resto')

export default sequelize;   