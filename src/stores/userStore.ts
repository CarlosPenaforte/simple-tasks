/* eslint-disable no-console */
import { UserToSend } from 'src/models/apiModels';
import { defineStore } from 'pinia';
import { User } from 'src/models/mainModels';
import {
	login, logout, register,
} from 'src/services/authService';
import { DateTime } from 'luxon';
import {
	formatDateToIso, getLocaleFormat, parseUser,
} from '../utils/commonFunctions';
import { api } from '../boot/axios';

export const useUserStore = defineStore('user', {
	state: () => ({
		user: undefined as User | undefined,
	}),
	actions: {
		async createUser(userToSend : UserToSend): Promise<[boolean, string]> {
			const localeFormat = getLocaleFormat(navigator.language);
			const parsedDate = DateTime.fromFormat(userToSend.birthday, localeFormat).toJSDate();

			const filteredUser = {
				...userToSend,
				birthday: formatDateToIso(parsedDate),
			};

			const response = await register(filteredUser);

			if (response.data.hasError) {
				return [ false, response.data.answer ];
			}

			return [ true, response.data.answer ];
		},
		updateUser(newUser : User) {
			if (newUser.userId === this.user?.userId) {
				this.user = newUser;
				return;
			}
			console.log('Different user was passed. To update, use the same used loggedIn');
		},
		setUser(user: User) {
			this.user = user;
		},
		async login(email: string, password: string): Promise<[boolean, string]> {
			const response = await login(email, password);

			if (response.data.token) {
				window.sessionStorage.setItem('simple-tasks/token', response.data.token);

				api.defaults.headers.common.token = response.data.token;
			}

			if (response.status === 200 && response.data.user && response.data.auth) {
				this.user = parseUser(response.data.user);

				return [ true, 'You are logged in' ];
			}

			if (response.status === 403 && response.data.auth === false) {
				return [ false, response.data.message || '' ];
			}

			return [ false, response.data.message || '' ];
		},
		async logout(): Promise<[boolean, string]> {
			if (this.user) {
				const response = await logout(this.user?.userId);

				this.user = undefined;

				if (response.data.hasError) {
					return [ false, response.data.message ];
				}
			}

			window.sessionStorage.removeItem('simple-tasks/token');

			this.user = undefined;

			return [ true, 'You are logged out' ];
		},
	},
});
