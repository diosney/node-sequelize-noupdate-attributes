import { Model } from 'sequelize';

export class TestModel extends Model {
  updatable1!: string;
  updatable2!: string;
  noUpdatable1!: string;
  noUpdatable2!: string;
  writable1!: string;
  noWritable1!: string;
  noWritable2!: string;
}