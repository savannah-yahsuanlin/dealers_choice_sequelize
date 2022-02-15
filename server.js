const express = require('express')
const methodOverride = require('method-override')
const {db, seedAndSync, models:{Characters, Games}} = require('./db')

const app = express()

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

const head = `
	<head>
		<title>Mario</title>
		<link rel="stylesheet" href="/style.css">
	<head>
`;

app.post('/', async(req, res, next) => {
	try {
		await Games.create(req.body)
		res.redirect('/')
	}
	catch(ex) {
		next(ex)
	}
})

app.get('/', async(req, res, next) => {
	try {
		const characters = await Characters.findAll({
			include: [Games]
		})
		const games = await Games.findAll({
			include: [Characters],
			order: ['id']
		})
		res.send(`
			<html>
				${head}
				<body>
					<h1>Mario Game</h1>
					<h5>Games</h5>
					<form method="POST">
						<small>Have not seen your favorite series. Please feel free to add here!<small>
						<input name="name" placeholder="game series">
						<select name="characterId">
							${characters.map(character => `
								<option value="${character.id}"> ${character.name}</option>
							`)}
						</select>
						<button>Add</button>
					</form>
					<ul>
						${games.map(game => `
							<li>
								${game.name}
									<a href="/characters/${game.characterId}">${game.character.name}</a>
							</li>
						`).join('')}
					</ul>
				</body>
			</html>
		`)
	}
	catch(ex) {
		next(ex)
	}
})

app.get('/characters/:id', async(req, res, next) => {
	try {
		const character = await Characters.findByPk(req.params.id, {include:[Games]})
		res.send(`
			<html>
				${head}
				<body>
					<h1>Mario Game</h1>
					<h5>${character.name}</h5>
					<ul>
						${character.games.map(game => `
							<li>${game.name}</li>
							<form method="POST" action="/${game.id}?_method=DELETE">
							<button>X</button>
							</form>
						`).join('')}
					</ul>
				</body>
			</html>
		`)
	}
	catch(ex) {
		next(ex)
	}
})

app.delete('/:id', async(req, res, next) => {
	try {
		const game = await Games.findByPk(req.params.id)
		await game.destroy()
		res.redirect('/')
	}
	catch(ex) {
		next(ex)
	}
})

const setUp = async(req, res, next) => {
	try {
		await seedAndSync()
		
		const port = process.env.PORT || 3000
		app.listen(port, () => {
			console.log(`Listening on PORT ${port}`)
		})
	}
	catch(ex) {
		console.log(ex)
	}
}

setUp()