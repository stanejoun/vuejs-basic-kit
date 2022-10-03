import { AbstractModel } from './AbstractModel';

export class Authorization extends AbstractModel {

  constructor (definition) {

    super();

    this.token = '';
    this.refreshToken = '';

    this.hydrate(definition);
  }
}