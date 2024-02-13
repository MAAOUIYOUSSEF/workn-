const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://maaouiyoussef:vWbieQ3m6PC1Ah2p@cluster0.lmxdrql.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Create a member schema
const memberSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  phone: String,
});

const Member = mongoose.model('Member', memberSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes
// Home page - Display all members
app.get('/', async (req, res) => {
  try {
    const members = await Member.find();
    res.render('index', { members });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Create member
app.post('/members', async (req, res) => {
  try {
    const { firstName, lastName, age, phone } = req.body;
    const member = new Member({ firstName, lastName, age, phone });
    await member.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete member
app.post('/members/delete', async (req, res) => {
  try {
    const { id } = req.body;
    await Member.findByIdAndDelete(id);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
