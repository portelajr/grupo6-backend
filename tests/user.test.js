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
  const INVALID_EMAIL = { message: 'Invalid email' };
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

  describe(('Quando o campo "email" é inválido'), () => {
    let response = {};
    
    before(async () => {
      response = await chai.request(server)
        .post('/user')
        .send({
          name: 'Kevin',
          email: 'emailemail.com',
        })
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Invalid email"', () => {
      expect(response.body).to.be.deep.equal(INVALID_EMAIL);
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

describe('POST /login', () => {
  const INVALID_USER = { message: 'Usuário inválido' };
  const INVALID_PASSWORD = { message: 'Senha inválida' };

  const user = {
    email: "email@email.com",
    password: "123456",
  }
  
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

  describe(('Quando o usuário não existe'), () => {
    let response = {};
    
    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({
          email: 'invalido@email.com',
          password: '123456',
        })
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Usuário inválido"', async () => {
      expect(response.body).to.be.deep.equal(INVALID_USER);
    });
  });

  describe(('Quando a senha é inválida'), () => {
    let response = {};
    
    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({
          email: 'email@email.com',
          password: '1234567',
        })
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Senha inválida"', async () => {
      expect(response.body).to.be.deep.equal(INVALID_PASSWORD);
    });
  });
});


describe('GET /user', () => {
  const INVALID_TOKEN = { message: "Expired or invalid token" };
  const user = {
    email: "email@email.com",
    password: "123456",
  }
  
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

  describe(('Quando o token não é válido'), () => {
    let response = {};
    
    before(async () => {
      response = await chai.request(server)
        .get('/user')
        .set('authorization', 'token')
    });

    it('Retorna status 401', () => {
      expect(response).to.have.status(401);
    });

    it('Retorna objeto com mensagem de erro "Expired or invalid token"', async () => {
      expect(response.body).to.be.deep.equal(INVALID_TOKEN);
    });
  });

  describe(('Quando o token é válido'), () => {
    let response = {};
    
    before(async () => {
      const token = await chai.request(server)
        .post('/login')
        .send(user)
        .then((res) => res.body.token)

      response = await chai.request(server)
        .get('/user')
        .set('authorization', token)
    });

    it('Retorna status 200', () => {
      expect(response).to.have.status(200);
    });

    it('Retorna objeto com dados do usuário', async () => {
      expect(response.body).to.be.deep.equal({name: 'Kevin', email: user.email});
    });
  });
});
