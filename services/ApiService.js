import { AuthenticationService } from './AuthenticationService';
import axios from '@axios';
import { I18n } from './I18n';
import { AppService } from './AppService';

export class ApiService {

	static AXIOS_INSTANCE;
	static IS_ALREADY_FETCHING_ACCESS_TOKEN;
	static SUBSCRIBERS;

	static init () {
		ApiService.AXIOS_INSTANCE = axios;
		ApiService.AXIOS_INSTANCE.defaults.baseURL = process.env.VUE_APP_API_URL;
		// For Refreshing Token
		ApiService.IS_ALREADY_FETCHING_ACCESS_TOKEN = false;
		// For Refreshing Token
		ApiService.SUBSCRIBERS = [];
		ApiService.httpInterceptors();
	}

	static getAxiosInstance () {
		return ApiService.AXIOS_INSTANCE;
	}

	static getResource (resource) {
		if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
			const parameterKey = resource.indexOf('?') !== -1 ? '&' : '?';
			resource = resource + parameterKey + 'XDEBUG_SESSION=PHPSTORM';
		}
		return resource;
	}

	static get (resource, slug, option = {}) {
		const currentResource = (slug) ? `${resource}/${slug}` : `${resource}`;
		return ApiService.getAxiosInstance().get(ApiService.getResource(currentResource), option);
	}

	static post (resource, slugOrParams, params = null, options = {}) {
		let slug = slugOrParams;
		if (!params) {
			params = slugOrParams;
			slug = null;
		}
		const currentResource = (slug || slug === 0) ? `${resource}/${slug}` : `${resource}`;
		return ApiService.getAxiosInstance().post(ApiService.getResource(currentResource), params, options);
	}

	static put (resource, slugOrParams, params = null) {
		let slug = slugOrParams;
		if (!params) {
			params = slugOrParams;
			slug = null;
		}
		const currentResource = (slug) ? `${resource}/${slug}` : `${resource}`;
		return ApiService.getAxiosInstance().put(ApiService.getResource(currentResource), params);
	}

	static delete (resource, slug) {
		const currentResource = (slug) ? `${resource}/${slug}` : `${resource}`;
		return ApiService.getAxiosInstance().delete(ApiService.getResource(currentResource));
	}

	static httpInterceptors () {
		// Request Interceptor
		axios.interceptors.request.use(config => {
			AppService.getInstance().$store.commit('app/UPDATE_DISPLAY_LOADING', true);
			// Get token from localStorage
			const token = AuthenticationService.getAuthorization().token;
			// If token is present add it to request's Authorization Header
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			config.headers['Accept-Language'] = I18n.getLocale();
			return config;
		}, error => Promise.reject(error));

		// Add request/response interceptor
		axios.interceptors.response.use((response) => {

				AppService.getInstance().$store.commit('app/UPDATE_DISPLAY_LOADING', false);
				return response;
				
			}, error => {

				AppService.getInstance().$store.commit('app/UPDATE_DISPLAY_LOADING', false);

				const { config, response } = error;
				const originalRequest = config;

				if (response && response.status === 401) {

					if (!ApiService.IS_ALREADY_FETCHING_ACCESS_TOKEN) {
						ApiService.IS_ALREADY_FETCHING_ACCESS_TOKEN = true;
						const refreshToken = AuthenticationService.getAuthorization().refreshToken;
						AuthenticationService.clearToken();
						AuthenticationService.refreshToken(refreshToken).then(refreshTokenResponse => {
							ApiService.onTokenFetched(refreshTokenResponse.data.token);
						}).catch(refreshTokenError => {
							if (refreshTokenError.response.status === 403) {
								window.location.href = '/error/forbidden';
								//AppService.getInstance().$router.push({ name: 'forbiddenError' });
							} else {
								window.location.href = '/auth/login';
								//AppService.getInstance().$router.push({ name: 'auth-login' });
							}
						}).finally(() => {
							ApiService.IS_ALREADY_FETCHING_ACCESS_TOKEN = false;
						});
					} else {
						window.location.href = '/auth/login';
						//AppService.getInstance().$router.push({ name: 'auth-login' });
					}

					return new Promise(resolve => {
						ApiService.addSubscriber(token => {
							// Change Authorization header
							originalRequest.headers.Authorization = `Bearer ${token}`;
							resolve(axios(originalRequest));
						});
					});
				}

				return Promise.reject(error);
			}
		);
	}

	static onTokenFetched (token) {
		ApiService.SUBSCRIBERS = ApiService.SUBSCRIBERS.filter(callback => callback(token));
	}

	static addSubscriber (callback) {
		ApiService.SUBSCRIBERS.push(callback);
	}
}
