const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const connection = require('./connectionMock');

const server = require('../api/app');

chai.use(chaiHttp);

const DB_NAME = 'Hackapp';

describe('POST /user', () => {
  const NAME_REQUIRED = { message: 'Name is required' };
  const EMAIL_REQUIRED = { message: 'Email field is required' };
  const PASSWORD_REQUIRED = { message: 'Password field is required' };
  const EMAIL_IN_USE = { message: 'Email already in use' };
  
  let connectionMock;
  let db;

  before(async () => {
    connectionMock = await connection();

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);

    db = connectionMock.db(DB_NAME);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe(('Quando o campo "name" não é enviado'), () => {
    let response = {};
    
    before(async () => {
      response = await chai.request(server)
        .post('/user')
        .send({})
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Name is required"', () => {
      expect(response.body).to.be.deep.equal(NAME_REQUIRED);
    });
  });

  describe(('Quando o campo "email" não é enviado'), () => {
    let response = {};
    
    before(async () => {
      response = await chai.request(server)
        .post('/user')
        .send({
          name: 'Kevin'
        })
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Email field is required"', () => {
      expect(response.body).to.be.deep.equal(EMAIL_REQUIRED);
    });
  });

  describe(('Quando o campo "password" não é enviado'), () => {
    let response = {};
    
    before(async () => {
      response = await chai.request(server)
        .post('/user')
        .send({
          name: 'Kevin',
          email: 'email@email.com',
        })
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Password field is required"', () => {
      expect(response.body).to.be.deep.equal(PASSWORD_REQUIRED);
    });
  });

  describe(('Quando o email enviado já está cadastrado'), () => {
    let response = {};

    before(async () => {
      await db.collection('users').insertOne({
        name: "Kevin",
        email: "email@email.com",
        password: "123456"
      })

      response = await chai.request(server)
        .post('/user')
        .send({
          name: "Junior",
          email: "email@email.com",
          password: "123456"
        })
    });

    after(async () => {
      await db.collection('users').deleteMany({});
    });

    it('Retorna status 409', () => {
      expect(response).to.have.status(409);
    });

    it('Retorna objeto com mensagem de erro "Email already in use"', () => {
      expect(response.body).to.be.deep.equal(EMAIL_IN_USE);
    });
  });

  describe(('Caso os dados sejam válidos'), () => {
    let response = {};
  
    before(async () => {
      response = await chai.request(server)
        .post('/user')
        .send({
          name: "Kevin",
          email: "email@email.com",
          password: "123456"
        })
    });

    after(async () => {
      await db.collection('users').deleteMany({});
    });

    it('Retorna status 201', async () => {
      expect(response).to.have.status(201);
    });

    it('Retorna usuário criado"', async () => {
      const { _id } = await db.collection('users')
        .findOne({ email: "email@email.com" });

      const user = {
        userId: _id.toString(),
        name: "Kevin",
        email: "email@email.com",
        password: "123456",
      }

      expect(response.body).to.be.deep.equal({ user });
    });
  });
});

describe.only('POST /users', () => {
  const NAME_REQUIRED = { message: 'Name is required' };
  const EMAIL_REQUIRED = { message: 'Email field is required' };
  const PASSWORD_REQUIRED = { message: 'Password field is required' };
  const EMAIL_IN_USE = { message: 'Email already in use' };
  
  let connectionMock;
  let db;

  before(async () => {
    connectionMock = await connection();

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);

    db = connectionMock.db(DB_NAME);

    await db.collection('users').insertOne({
      name: "Kevin",
      email: "email@email.com",
      password: "123456",
    });
  });

  after(async () => {
    MongoClient.connect.restore();
    await db.collection('users').deleteMany({});
  });

  describe(('Quando os campos são válidos'), () => {
    let response = {};
    
    before(async () => {
      const {token} = await chai.request(server)
        .post('/login')
        .send({
          email: "email@email.com",
          password: "123456",
        })
        .then((res) => res.body.token)

      response = await chai.request(server)
        .get('/user')
        .set('authorization', token)
    });

    it('Retorna status 201', () => {
      expect(response).to.have.status(201);
    });

    it('Retorna objeto com mensagem de erro "Invalid entries. Try again."', async () => {
      const dbRecipe = await db.collection('recipes').findOne({ name: "Frango" });
      const recipe = { ...dbRecipe, _id: dbRecipe._id.toString() }
      expect(response.body).to.be.deep.equal({ recipe });
    });
  });
});