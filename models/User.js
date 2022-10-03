import {AbstractModel} from './AbstractModel';

export class User extends AbstractModel {

    constructor(definition) {

        super();

        this.id = '';
        this.firstname = '';
        this.lastname = '';
        this.roles = [];
        this.avatar = '';

        this.hydrate(definition);

        this.fullName = this.firstname + ' ' + this.lastname;
        this.email = (definition && definition.emailAddress) ? definition.emailAddress : '';
    }
}