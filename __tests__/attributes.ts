import {
  describe,
  it
} from 'mocha';

import { expect } from 'chai';

import {
  DataTypes,
  Sequelize,
  ValidationError
} from 'sequelize';

import { TestModel } from './fixtures';

import sequelizeNoUpdate from '../src';

const sequelize = new Sequelize('sqlite::memory:', {
  logging: false
});

sequelizeNoUpdate(sequelize);

TestModel.init({
  updatable1  : {
    type     : DataTypes.STRING,
    allowNull: true
  },
  updatable2  : {
    type     : DataTypes.STRING,
    allowNull: true,
    noUpdate : false
  },
  noUpdatable1: {
    type     : DataTypes.STRING,
    allowNull: true,
    noUpdate : true
  },
  noUpdatable2: {
    type     : DataTypes.STRING,
    allowNull: true,
    noUpdate : {
      readOnly: false
    }
  },
  writable1   : {
    type     : DataTypes.STRING,
    allowNull: true,
    readOnly : false
  },
  noWritable1 : {
    type     : DataTypes.STRING,
    allowNull: true,
    noUpdate : {
      readOnly: true
    }
  },
  noWritable2 : {
    type     : DataTypes.STRING,
    allowNull: true,
    readOnly : true
  }
}, {
  sequelize,
  modelName: 'TestModel'
});

describe('`noUpdateAttributes` tests', () => {
  before(async () => {
    await sequelize.sync({ force: true });
  });

  after(async () => {
    await sequelize.drop();
  });

  describe('if `noUpdate`', () => {
    describe('was not set', () => {
      it('should allow attribute modification', async () => {
        const instance = await TestModel.create({
          updatable1: Math.random().toString()
        });

        expect(instance).to.not.be.null;

        let error: Error | null = null;
        try {
          await instance.update({
            updatable1: Math.random().toString()
          });
        }
        catch (err: any) {
          error = err;
        }

        expect(error).to.be.null;
      });
    });

    describe('was set', () => {
      describe('and it is `false`', () => {
        it('should allow modifications on attributes', async () => {
          const instance = await TestModel.create({
            updatable2: Math.random().toString()
          });

          expect(instance).to.not.be.null;

          let error: Error | null = null;
          try {
            await instance.update({
              updatable2: Math.random().toString()
            });
          }
          catch (err: any) {
            error = err;
          }

          expect(error).to.be.null;
        });
      });

      describe('and it is `true`', () => {
        it('should NOT allow modifications on attribute previously set', async () => {
          const instance = await TestModel.create({
            noUpdatable1: Math.random().toString()
          });

          expect(instance).to.not.be.null;

          let error: Error | null = null;
          try {
            // `.create` acts as a first update since saves data to `previous`.
            await instance.update({
              noUpdatable1: Math.random().toString()
            });
          }
          catch (err: any) {
            error = err;
          }

          expect(error).to.be.instanceOf(ValidationError);
        });

        it('should allow modifications on attribute NOT previously set', async () => {
          const instance = await TestModel.create({
            // By not setting its value here, it will default to null.
            // noUpdatable1: null,
          });

          expect(instance).to.not.be.null;

          let error: Error | null = null;
          try {
            // `.create` acts as a first update since saves data to `previous`.
            await instance.update({
              noUpdatable1: Math.random().toString()
            });
          }
          catch (err: any) {
            error = err;
          }

          expect(error).to.be.null;
        });
      });

      describe('and nested `readonly` was set', function () {
        describe('and it is `false`', () => {
          it('should NOT allow modifications on attribute', async () => {
            const instance = await TestModel.create({
              noUpdatable2: Math.random().toString()
            });

            expect(instance).to.not.be.null;

            let error: Error | null = null;
            try {
              await instance.update({
                noUpdatable2: Math.random().toString()
              });
            }
            catch (err: any) {
              error = err;
            }

            expect(error).to.be.instanceOf(ValidationError);
          });
        });

        describe('and it is `true`', () => {
          it('should NOT allow modifications on attribute NOT previously set', async () => {
            const instance = await TestModel.create({
              // By not setting its value here, it will default to null.
              // noWritable1: null,
            });

            expect(instance).to.not.be.null;

            let error: Error | null = null;
            try {
              // `.create` acts as a first update since saves data to `previous`.
              await instance.update({
                noWritable1: Math.random().toString()
              });
            }
            catch (err: any) {
              error = err;
            }

            expect(error).to.be.instanceOf(ValidationError);
          });

          it('should NOT allow modifications on attribute', async () => {
            const instance = await TestModel.create({
              noWritable1: Math.random().toString()
            });

            expect(instance).to.not.be.null;

            let error: Error | null = null;
            try {
              await instance.update({
                noWritable1: Math.random().toString()
              });
            }
            catch (err: any) {
              error = err;
            }

            expect(error).to.be.instanceOf(ValidationError);
          });
        });
      });
    });
  });

  describe('if `readOnly`', () => {
    describe('was not set', () => {
      it('should allow attribute modification', async () => {
        const instance = await TestModel.create({
          updatable1: Math.random().toString()
        });

        expect(instance).to.not.be.null;

        let error: Error | null = null;
        try {
          await instance.update({
            updatable1: Math.random().toString()
          });
        }
        catch (err: any) {
          error = err;
        }

        expect(error).to.be.null;
      });
    });

    describe('was set', () => {
      describe('and it is `false`', () => {
        it('should allow modifications on attributes', async () => {
          const instance = await TestModel.create({
            writable1: Math.random().toString()
          });

          expect(instance).to.not.be.null;

          let error: Error | null = null;
          try {
            await instance.update({
              writable1: Math.random().toString()
            });
          }
          catch (err: any) {
            error = err;
          }

          expect(error).to.be.null;
        });
      });

      describe('and it is `true`', () => {
        it('should NOT allow modifications on attribute NOT previously set', async () => {
          const instance = await TestModel.create({
            // By not setting its value here, it will default to null.
            // noWritable2: Math.random().toString()
          });

          expect(instance).to.not.be.null;

          let error: Error | null = null;
          try {
            // `.create` acts as a first update since saves data to `previous`.
            await instance.update({
              noWritable2: Math.random().toString()
            });
          }
          catch (err: any) {
            error = err;
          }

          expect(error).to.be.instanceOf(ValidationError);
        });

        it('should NOT allow modifications on attribute previously set', async () => {
          const instance = await TestModel.create({
            noWritable2: Math.random().toString()
          });

          expect(instance).to.not.be.null;

          let error: Error | null = null;
          try {
            // `.create` acts as a first update since saves data to `previous`.
            await instance.update({
              noWritable2: Math.random().toString()
            });
          }
          catch (err: any) {
            error = err;
          }

          expect(error).to.be.instanceOf(ValidationError);
        });
      });
    });
  });
});