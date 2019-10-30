const { factory } = require('factory-girl');
const faker = require('faker');
const models = require('../../app/models');
const { user: User } = models;

factory.define('user', User, {
  firstName: () => faker.name.firstName(),
  lastName: () => faker.name.lastName(),
  email: () => faker.internet.email(),
  username: () => faker.internet.email(),
  password: () => faker.internet.password()
});

module.exports = {
  create: params => factory.create('user', params),
  createMany: () => factory.createMany('user', 5),
  build: params => factory.build('user', params),
  attributes: params => factory.attrs('user', params)
};
