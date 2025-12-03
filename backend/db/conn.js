const {Sequelize} = require('sequelize')
const sequelize = new Sequelize('ecommerce_db', 'root', 'root', {
    dialect: 'mysql',
})

sequelize.authenticate().then(()=> {
    console.log('Conectado ao banco de dados!')
}).catch((err)=> {
    console.log(`Erro ao conectar: ${err}`)
})

module.exports = sequelize