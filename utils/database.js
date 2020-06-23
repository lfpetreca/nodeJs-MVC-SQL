const Sequelize = require('sequelize')

const sequelize = new Sequelize(
    'node-complete',  //DB name
    'root',           //DB User   
    'PASS',      //DB Password
    {
        dialect: 'mysql',
        host: 'localhost'
    })

module.exports = sequelize