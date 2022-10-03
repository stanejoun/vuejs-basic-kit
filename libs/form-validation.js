import { extend } from 'vee-validate';
import { AppService } from '../services/AppService';
import { required } from '@validations';
import { email, integer } from './validations/validations';

export const rule_required = extend('required', {
	...required,
	message: AppService.$t('This field is required.')
});

export const rule_email = extend('email', {
	...email,
	message: AppService.$t('This email is invalid.')
});

export const rule_integer = extend('integer', {
	...integer,
	message: AppService.$t('This number is invalid.')
});