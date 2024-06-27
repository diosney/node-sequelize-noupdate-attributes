import {
  describe,
  it
} from 'mocha';

import { expect } from 'chai';

import { Sequelize } from 'sequelize';
import sequelizeNoUpdate from '../src';

const sequelize = new Sequelize('sqlite::memory:');

describe('when registering the plugin', function () {
  describe('if no `sequelize` instance was passed as parameter to `addHook`', function () {
    it('should throw an error', async function () {
      expect(sequelizeNoUpdate).to.throw();
    });
  });

  describe('if `sequelize` instance was passed as parameter to `addHook`', function () {
    it('should throw an error', async function () {
      expect(sequelizeNoUpdate.bind(this, sequelize)).to.not.throw();
    });
  });
});
