const client = require('../lib/client');
// import our seed data:
const pinball_machines = require('./pinball_machines.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      pinball_machines.map(pinball => {
        return client.query(`
                    INSERT INTO pinball_machines (name, year_manufactured, manufacturer, multiball, owner_id)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [pinball.name, pinball.year_manufactured, pinball.manufacturer, pinball.multiball, user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
