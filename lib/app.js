const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/pinball_machines', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT pinball_machines.id AS pinball_id, pinball_machines.name, pinball_machines.year_manufactured, pinball_machines.multiball, manufacturers.manufacturer FROM pinball_machines
    JOIN manufacturers
    ON manufacturers.id = pinball_machines.manufacturer_id
    ORDER BY pinball_machines.name desc 
    `);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.get('/pinball_machines/:id', async(req, res) => {
  try {
    const pinball_id = req.params.id;

    const data = await client.query(`SELECT * from pinball_machines
    WHERE pinball_machines.id=$1
    `, [pinball_id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.post('/pinball_machines/', async(req, res) => {
  try {
    const newName = req.body.name;
    const newYear = req.body.year_manufactured;
    const newmanufacturer_id = req.body.manufacturer_id;
    const newMultiball = req.body.multiball;    
    const ownerId = req.body.owner_id;

    const data = await client.query(`
      INSERT INTO pinball_machines (name, year_manufactured, manufacturer_id, multiball, owner_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`, [newName, newYear, newmanufacturer_id, newMultiball, ownerId]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.put('/pinball_machines/:id', async(req, res) => {
  try {
    const newName = req.body.name;
    const newYear = req.body.year_manufactured;
    const newmanufacturer_id = req.body.manufacturer_id;
    const newMultiball = req.body.multiball;
    const ownerId = req.body.owner_id;

    const data = await client.query(`
      UPDATE pinball_machines
      SET name = $1,
          year_manufactured = $2,
          manufacturer_id = $3,
          multiball = $4,
          owner_id = $5
          WHERE pinball_machines.id = $6
          RETURNING *;
      `, 
    [newName, newYear, newmanufacturer_id, newMultiball, ownerId, req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.delete('/pinball_machines/:id', async(req, res) => {
  try {
    const pinball_machineId = req.params.id;

    const data = await client.query(`
      DELETE from pinball_machines
      WHERE pinball_machines.id = $1
      `, 

    [pinball_machineId]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
