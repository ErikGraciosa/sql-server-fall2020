require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    // let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      // const signInData = await fakeRequest(app)
      //   .post('/auth/signup')
      //   .send({
      //     email: 'jon@user.com',
      //     password: '1234'
      //   });
      
      // token = signInData.body.token;
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns pinball_machines using /GET', async() => {

      const expectation = [
        {
          'pinball_id': 1,
          'name': 'Skateball',
          'year_manufactured': 1974,
          'manufacturer': 'Bally',
          'multiball': false,
          'owner_id': 1
        },
        {
          'pinball_id': 2,          
          'name': 'Firepower',          
          'year_manufactured': 1980,
          'manufacturer': 'Williams',
          'multiball': true,
          'owner_id': 1       
        },
        {
          'pinball_id': 3,
          'name': 'The Addams Family',
          'year_manufactured': 1994,
          'manufacturer': 'Williams',
          'multiball': true,
          'owner_id': 1
        },
        {
          'pinball_id': 4,
          'name': 'World Cup Soccer 94',
          'year_manufactured': 1994,
          'manufacturer': 'Williams',
          'multiball': true,
          'owner_id': 1
        },
        {
          'pinball_id': 5,
          'name': 'Fish Tales',
          'year_manufactured': 1992,
          'manufacturer': 'Williams',
          'multiball': true,
          'owner_id': 1
        },
        {
          'pinball_id': 6,
          'name': 'Iron Maiden',
          'year_manufactured': 2017,
          'manufacturer': 'Stern',
          'multiball': true,
          'owner_id': 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/pinball_machines')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('returns single pinball_machines using /GET:id', async() => {

      const expectation = {
        'pinball_id': 1,
        'name': 'Skateball',
        'year_manufactured': 1974,
        'manufacturer': 'Bally',
        'multiball': false,
        'owner_id': 1
      }
      ;

      const data = await fakeRequest(app)
        .get('/pinball_machines/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('returns full list of manufacturers using get route /manufacturers', async() => {

      const expectation = [
        {
          'id': 1,
          'manufacturer': 'Bally'
        },
        {
          'id': 2,
          'manufacturer': 'Stern'
        },
        {
          'id': 3,
          'manufacturer': 'Williams'
        }
      ]
      ;

      const data = await fakeRequest(app)
        .get('/manufacturers')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('returns pinball_machines after post sent to confirm added entry', async() => {

      const expectation = [
        {
          'pinball_id': 1,
          'name': 'Skateball',
          'year_manufactured': 1974,
          'manufacturer': 'Bally',
          'multiball': false,
          'owner_id': 1
        },
        {
          'pinball_id': 2,          
          'name': 'Firepower',          
          'year_manufactured': 1980,
          'manufacturer': 'Williams',
          'multiball': true,
          'owner_id': 1       
        },
        {
          'pinball_id': 3,
          'name': 'The Addams Family',
          'year_manufactured': 1994,
          'manufacturer': 'Williams',
          'multiball': true,
          'owner_id': 1
        },
        {
          'pinball_id': 4,
          'name': 'World Cup Soccer 94',
          'year_manufactured': 1994,
          'manufacturer': 'Williams',
          'multiball': true,
          'owner_id': 1
        },
        {
          'pinball_id': 5,
          'name': 'Fish Tales',
          'year_manufactured': 1992,
          'manufacturer': 'Williams',
          'multiball': true,
          'owner_id': 1
        },
        {
          'pinball_id': 6,
          'name': 'Iron Maiden',
          'year_manufactured': 2017,
          'manufacturer': 'Stern',
          'multiball': true,
          'owner_id': 1
        },
        {
          'pinball_id': 7,
          'name': 'Paragon',
          'year_manufactured': 1976,
          'manufacturer': 'Bally',
          'multiball': false,
          'owner_id': 1
        },
      ];

      await fakeRequest(app)
        .post('/pinball_machines')
        .send({
          'name': 'Paragon',
          'year_manufactured': 1976,
          'manufacturer_id': 1,
          'multiball': false,
          'owner_id': 1
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const data = await fakeRequest(app)
        .get('/pinball_machines')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    



    test('returns pinball_machines after put sent to confirm update ', async() => {

      const expectation = [
        {
          'pinball_id': 1,
          'name': 'Skateball',
          'year_manufactured': 1974,
          'manufacturer': 'Bally',
          'multiball': false,
          'owner_id': 1
        },
        {
          'pinball_id': 2,          
          'name': 'Firepower',          
          'year_manufactured': 1980,
          'manufacturer': 'Williams',
          'multiball': true,
          'owner_id': 1       
        },
        {
          'pinball_id': 3,
          'name': 'The Addams Family',
          'year_manufactured': 1994,
          'manufacturer': 'Williams',
          'multiball': true,
          'owner_id': 1
        },
        {
          'pinball_id': 4,
          'name': 'World Cup Soccer 94',
          'year_manufactured': 1994,
          'manufacturer': 'Williams',
          'multiball': true,
          'owner_id': 1
        },
        {
          'pinball_id': 5,
          'name': 'Fish Tales',
          'year_manufactured': 1992,
          'manufacturer': 'Williams',
          'multiball': true,
          'owner_id': 1
        },
        {
          'pinball_id': 6,
          'name': 'Iron Maiden',
          'year_manufactured': 2017,
          'manufacturer': 'Stern',
          'multiball': true,
          'owner_id': 1
        },
        {
          'pinball_id': 7,
          'name': 'Paragon 2.0',
          'year_manufactured': 2000,
          'manufacturer': 'Bally',
          'multiball': true,
          'owner_id': 1
        },
      ];

      await fakeRequest(app)
        .put('/pinball_machines/7')
        .send({
          'name': 'Paragon 2.0',
          'year_manufactured': 2000,
          'manufacturer_id': 1,
          'multiball': true,
          'owner_id': 1
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const data = await fakeRequest(app)
        .get('/pinball_machines')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('returns pinball_machines after /DELETE to remove a pinball machine', async() => {

      const expectation = [
        {
          'pinball_id': 2,          
          'name': 'Firepower',          
          'year_manufactured': 1980,
          'manufacturer': 'Williams',
          'multiball': true,
          'owner_id': 1       
        },
        {
          'pinball_id': 3,
          'name': 'The Addams Family',
          'year_manufactured': 1994,
          'manufacturer': 'Williams',
          'multiball': true,
          'owner_id': 1
        },
        {
          'pinball_id': 4,
          'name': 'World Cup Soccer 94',
          'year_manufactured': 1994,
          'manufacturer': 'Williams',
          'multiball': true,
          'owner_id': 1
        },
        {
          'pinball_id': 5,
          'name': 'Fish Tales',
          'year_manufactured': 1992,
          'manufacturer': 'Williams',
          'multiball': true,
          'owner_id': 1
        },
        {
          'pinball_id': 6,
          'name': 'Iron Maiden',
          'year_manufactured': 2017,
          'manufacturer': 'Stern',
          'multiball': true,
          'owner_id': 1
        },
        {
          'pinball_id': 7,
          'name': 'Paragon 2.0',
          'year_manufactured': 2000,
          'manufacturer': 'Bally',
          'multiball': true,
          'owner_id': 1
        }
      ];

      await fakeRequest(app)
        .delete('/pinball_machines/1')
        .expect('Content-Type', /json/)
        .expect(200);

      const data = await fakeRequest(app)
        .get('/pinball_machines')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
