const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const uri = "mongodb+srv://aurielballard:X16teNzpqGppo4OW@jokedb.bbw5k.mongodb.net/Main?retryWrites=true&w=majority&appName=Main";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("mongodb connected."))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const JokeSchema = new Schema({
  category: {
    type: String,
    required: true,
    trim: true,
  },
  joke: {
    type: String,
    required: true,
    trim: true,
  },
  postDate: {
    type: Date,
    default: Date.now,
  },
});

JokeSchema.statics.addJoke = async function(category, jokeText) {
  const joke = new this({ category, joke: jokeText });
  return await joke.save();
};

JokeSchema.statics.getJokes = async function() {
  return await this.find();
};

JokeSchema.statics.removeJokeById = async function(id) {
  const result = await this.deleteOne({ _id: id });
  if (result.deletedCount === 1) {
    return { success: true, message: "Joke deleted." };
  } else {
    return { success: false, message: "Joke not found." };
  }
};

const Joke = model('Joke', JokeSchema, 'Jokes');

async function addJoke(category, jokeText) {
  return Joke.addJoke(category, jokeText);
}

async function getJokes() {
  return Joke.getJokes();
}

async function removeJokeById(id) {
  return Joke.removeJokeById(id);
}

module.exports = {
  addJoke,
  getJokes,
  removeJokeById,
};
