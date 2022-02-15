const {Sequelize, DataTypes, models} = require('sequelize')
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_sequelize')

const Characters = db.define('characters', {
	name: {
		type: DataTypes.STRING,
		allowNull: false
	}
})

const Games = db.define('games', {
	name: {
		type: DataTypes.STRING,
		allowNull: false
	}
})

Games.belongsTo(Characters)
Characters.hasMany(Games)

const seedAndSync = async() => {
	await db.sync({force: true})

	const toad = await Characters.create({name: 'toad'})
	const mario = await Characters.create({name: 'mario'})
	const luigi = await Characters.create({name: 'luigi'})
	const peach = await Characters.create({name: 'peach'})
	const daisy = await Characters.create({name: 'daisy'})
	const yoshi = await Characters.create({name: 'yoshi'})
	const wario = await Characters.create({name: 'wario'})
	const toadette = await Characters.create({name: 'toadette'})
	

	await Games.create({name: 'advanceFour', characterId: mario.id })
	await Games.create({name: 'advanceTwo', characterId: luigi.id})
	await Games.create({name: '3dWorld', characterId: toad.id})
	await Games.create({name: 'galaxy', characterId: toadette.id})
	await Games.create({name: 'party', characterId: luigi.id})
	await Games.create({name: 'world', characterId: toad.id})
	await Games.create({name: 'land', characterId: mario.id})
	await Games.create({name: 'bros', characterId: luigi.id})
	await Games.create({name: 'run', characterId: toadette.id})
	
}

module.exports = {
	db,
	seedAndSync,
	models: {
		Characters,
		Games
	}
}