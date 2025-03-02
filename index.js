const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { addJoke, getJokes, removeJokeById } = require('./mongoDB');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'public', 'frontend')]);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.render('main');
});

app.get('/create-joke', (req, res) => {
  res.render('addJokePage');
});

app.get('/allJokes', async (req, res) => {
  try {
    const jokes = await getJokes();
    res.json(jokes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/addJoke', async (req, res) => {
  try {
    const category = req.body.category ? req.body.category.trim() : '';
    const jokeText = req.body.joke ? req.body.joke.trim() : '';
    const newJoke = await addJoke(category, jokeText);
    res.json(newJoke);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/deleteJoke/:id', async (req, res) => {
  try {
    const id = req.params.id.trim();
    const result = await removeJokeById(id);
    if (result.success === false) {
      res.status(404).json(result);
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
