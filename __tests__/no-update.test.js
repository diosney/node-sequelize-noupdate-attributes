const { factory } = require('factory-girl');
const { DataTypes, Sequelize } = require('sequelize');
const faker = require('faker/locale/pt_BR');
const sequelizeNoUpdate = require('../lib');

const sequelize = new Sequelize('sqlite::memory:', {
  logging: false, // Disables logging
});

sequelizeNoUpdate(sequelize);

const Model_1 = sequelize.define('Model_1', {
  attr1: DataTypes.STRING,
  attr2: DataTypes.STRING,
});

const Model_2 = sequelize.define('Model_2', {
  attr1: {
    type: DataTypes.STRING,
    noUpdate: true,
  },
  attr2: {
    type: DataTypes.STRING,
    noUpdate: false,
  },
  attr3: DataTypes.STRING,
});

const Model_3 = sequelize.define('Model_3', {
  attr1: {
    type: DataTypes.STRING,
    noUpdate: {
      readOnly: true,
    },
  },
  attr2: {
    type: DataTypes.STRING,
    noUpdate: false,
  },
  attr3: DataTypes.STRING,
});

factory.define('Model_1', Model_1, {
  attr1: faker.name.findName(),
  attr2: faker.name.findName(),
  attr3: faker.name.findName(),
});
factory.define('Model_2', Model_2, {
  attr1: faker.name.findName(),
  attr2: faker.name.findName(),
  attr3: faker.name.findName(),
});
factory.define('Model_3', Model_3, {
  attr1: faker.name.findName(),
  attr2: faker.name.findName(),
  attr3: faker.name.findName(),
});

describe('if `noUpdate`', () => {
  beforeAll(() => {
    return sequelize.sync({
      force: true,
    });
  });

  describe('was not set', () => {
    it('should allow attributes modifications', async () => {
      const model_1 = await factory.create('Model_1');

      const response = model_1.update(
        { attr1: 'david' },
        {
          where: { id: model_1.id },
        }
      );

      await expect(response).resolves.toMatchObject(response);
    });
  });

  describe('was set', () => {
    it('should allow modifications on attributes without `noUpdate` set', async () => {
      const model_2 = await factory.create('Model_2');

      const response = model_2.update(
        { attr3: 'david' },
        {
          where: { id: model_2.id },
        }
      );

      await expect(response).resolves.toMatchObject(response);
    });
    it('should allow modifications on attributes with `noUpdate=false` set', async () => {
      const model_2 = await factory.create('Model_2');

      const response = model_2.update(
        { attr2: 'david' },
        {
          where: { id: model_2.id },
        }
      );

      await expect(response).resolves.toMatchObject(response);
    });
  });

  it('should not allow modifications on attributes with `noUpdate=true` set', async () => {
    const model_2 = await factory.create('Model_2');

    const response = model_2.update(
      { attr1: 'david' },
      {
        where: { id: model_2.id },
      }
    );

    await expect(response).rejects.toThrow(
      '`attr1` cannot be updated due `noUpdate` constraint'
    );
  });

  describe('and readonly was set', () => {
    it('should not allow modifications on attributes with `readOnly=true` set', async () => {
      const model_3 = await factory.create('Model_3');

      const response = model_3.update(
        { attr1: 'david' },
        {
          where: { id: model_3.id },
        }
      );

      await expect(response).rejects.toThrow(
        'attr1` cannot be updated due `noUpdate:readOnly` constraint'
      );
    });
  });
});
