import {User} from '../models/User';
import {Authorization} from '../models/Authorization';
import {ApiService} from './ApiService';
import {AppService} from './AppService';

export class AuthenticationService {

	static LOCAL_STORAGE_USER_DATA_KEY_NAME = `buybox_user_data`;
	static LOCAL_STORAGE_TOKEN_KEY_NAME = 'buybox_access_token';
	static LOCAL_STORAGE_REFRESH_TOKEN_KEY_NAME = 'buybox_refresh_token';

	static getRoles() {
		return [
			{
				name: 'admin',
				priority: 1
			},
			{
				name: 'user',
				priority: 2
			}
		];
	}

	static getUserData() {
		const userData = localStorage.getItem(AuthenticationService.LOCAL_STORAGE_USER_DATA_KEY_NAME);
		if (userData) {
			return new User(JSON.parse(userData));
		}
		return new User();
	}

	static clearAuthorization() {
		localStorage.removeItem(AuthenticationService.LOCAL_STORAGE_USER_DATA_KEY_NAME);
		localStorage.removeItem(AuthenticationService.LOCAL_STORAGE_TOKEN_KEY_NAME);
		localStorage.removeItem(AuthenticationService.LOCAL_STORAGE_REFRESH_TOKEN_KEY_NAME);
	}

	static clearToken() {
		localStorage.removeItem(AuthenticationService.LOCAL_STORAGE_TOKEN_KEY_NAME);
	}

	static getAuthorization() {
		const token = localStorage.getItem(AuthenticationService.LOCAL_STORAGE_TOKEN_KEY_NAME);
		const refreshToken = localStorage.getItem(AuthenticationService.LOCAL_STORAGE_REFRESH_TOKEN_KEY_NAME);
		if (token && refreshToken) {
			return new Authorization({
				token: token,
				refreshToken: refreshToken
			});
		}
		return new Authorization();
	}

	static isAuthenticated() {
		if (typeof AuthenticationService.getUserData().id === 'undefined') {
			console.error('Error: missing user id!');
		}
		return AuthenticationService.getAuthorization().refreshToken && AuthenticationService.getUserData().id;
	}

	static hasRole(roleName) {
		if (AuthenticationService.isAuthenticated()) {
			const user = AuthenticationService.getUserData();
			if (user.roles.indexOf(roleName) !== -1 || user.roles.indexOf('admin') !== -1) {
				return true;
			}
			const roles = AuthenticationService.getRoles();
			const rolePriorities = {};
			for (const role of roles) {
				rolePriorities[role.name] = role.priority;
			}
			for (const userRole of user.roles) {
				if (typeof rolePriorities[roleName] !== 'undefined' && typeof rolePriorities[userRole] !== 'undefined' && rolePriorities[userRole] < rolePriorities[roleName]) {
					return true;
				}
			}
		}
		return false;
	}

	static hasRoles(roleNames) {
		if (AuthenticationService.isAuthenticated()) {
			for (const roleName in roleNames) {
				if (AuthenticationService.hasRole(roleName)) {
					return false;
				}
			}
			return true;
		}
		return false;
	}

	static async token(identifier, password) {
		AuthenticationService.clearAuthorization();
		const params = {
			login: identifier,
			password: password
		};
		try {
			const response = await ApiService.post('/api/login_check', params);
			if (response.data && response.data.token && response.data.refreshToken) {
				localStorage.setItem(AuthenticationService.LOCAL_STORAGE_TOKEN_KEY_NAME, response.data.token);
				localStorage.setItem(AuthenticationService.LOCAL_STORAGE_REFRESH_TOKEN_KEY_NAME, response.data.refreshToken);
				const getCurrentUserResponse = await ApiService.get('/api/user');
				if (getCurrentUserResponse.data && getCurrentUserResponse.data.user) {
					localStorage.setItem(AuthenticationService.LOCAL_STORAGE_USER_DATA_KEY_NAME, JSON.stringify(getCurrentUserResponse.data.user));
				}
				return response;
			}
		} catch (e) {
			console.error('Error: unable to get the access token!');
		}
		return null;
	}

	static async refreshToken(refreshToken) {
		const response = await ApiService.post('/api/token/refresh', {refreshToken: refreshToken});
		localStorage.setItem(AuthenticationService.LOCAL_STORAGE_TOKEN_KEY_NAME, response.data.token);
		localStorage.setItem(AuthenticationService.LOCAL_STORAGE_REFRESH_TOKEN_KEY_NAME, response.data.refreshToken);
		return response;
	}

	static async logout() {
		AuthenticationService.clearAuthorization();
		await AppService.getInstance().$router.push({name: 'login'});
	}

	static canNavigate(toRoute) {
		if (toRoute.meta && toRoute.meta.requiresAuth === false) {
			return true;
		}
		if (!AuthenticationService.isAuthenticated()) {
			return false;
		}
		if (toRoute.meta) {
			if (toRoute.meta.role && !AuthenticationService.hasRole(toRoute.meta.role)) {
				return false;
			}
			if (toRoute.meta.roles && !AuthenticationService.hasRoles(toRoute.meta.roles)) {
				return false;
			}
		}
		return true;
	}
}