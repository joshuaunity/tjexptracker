const { Sequelize } = require('sequelize');
const config = require('./config/config');

console.log("DB_HOST", config.development.host);
const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
    host: config.development.host,
    port: config.development.port,
    dialect: 'postgres',
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = sequelize;