import { ComposerTranslation } from 'vue-i18n';
/* eslint-disable no-console */
import {
	ReceivedUser, CreateUserToSend, UpdateUserToSend,
} from 'src/models/apiModels';
import { defineStore } from 'pinia';
import { User } from 'src/models/mainModels';
import {
	login, logout,
} from 'src/services/authService';
import { DateTime } from 'luxon';
import {
	update, register, getById,
} from '../services/userService';
import {
	formatDateToIso, getLocaleFormat, parseUser,
} from '../utils/commonFunctions';
import { api } from '../boot/axios';

export const useUserStore = defineStore('user', {
	state: () => ({
		user: undefined as User | undefined,
	}),
	actions: {
		async createUser(userToSend: CreateUserToSend): Promise<[boolean, string]> {
			const localeFormat = getLocaleFormat(navigator.language);
			const parsedDate = DateTime.fromFormat(userToSend.birthday, localeFormat).setZone('utc').toJSDate();

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
		async updateUser(
			$t: ComposerTranslation,
			userId: number,
			userToSend: UpdateUserToSend,
		): Promise<[boolean, string | ReceivedUser]> {
			const localeFormat = getLocaleFormat(navigator.language);
			const parsedDate = DateTime.fromFormat(userToSend.birthday, localeFormat).setZone('utc').toJSDate();

			const filteredUser = {
				...userToSend,
				birthday: formatDateToIso(parsedDate),
			};

			const response = await update(userId, filteredUser);

			if (response.data.hasError) {
				return [ false, response.data?.answer || '' ];
			}

			if (!response.data?.user) return [ false, $t('COMMON.INTERNAL_ERROR') ];

			this.user = parseUser(response.data.user);

			return [ true, response.data.user ];
		},
		async getUser(userId: number): Promise<[boolean, string | ReceivedUser]> {
			const response = await getById(userId);

			if (response.data.hasError) {
				return [ false, response.data?.message || '' ];
			}

			if (!response.data?.user) return [ false, 'Internal error' ];

			this.user = parseUser(response.data.user);

			return [ true, response.data.user ];
		},
		setUser(user: User) {
			this.user = user;
		},
		async login($t: ComposerTranslation, email: string, password: string): Promise<[boolean, string]> {
			const response = await login(email, password);

			if (response.data.token) {
				window.sessionStorage.setItem('simple-tasks/token', response.data.token);

				api.defaults.headers.common.token = response.data.token;
			}

			if (response.status === 200 && response.data.user && response.data.auth) {
				this.user = parseUser(response.data.user);
				window.sessionStorage.setItem('simple-tasks/user_id', `${this.user.userId}`);

				return [ true, $t('AUTH.SUCCESS') ];
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
			window.sessionStorage.removeItem('simple-tasks/user_id');

			this.user = undefined;

			return [ true, 'Logout' ];
		},
	},
});
