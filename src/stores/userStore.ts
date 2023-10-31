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
import {
	update, register, getById, deleteById,
} from '../services/userService';
import {
	parseUser,
} from '../utils/commonFunctions';
import { api } from '../boot/axios';

export const useUserStore = defineStore('user', {
	state: () => ({
		user: undefined as User | undefined,
	}),
	actions: {
		async createUser(userToSend: CreateUserToSend): Promise<[boolean, string]> {
			const response = await register(userToSend);

			if (response.data.hasError) {
				return [ false, response.data.message ];
			}

			return [ true, response.data.message ];
		},
		async updateUser(
			$t: ComposerTranslation,
			userId: number,
			userToSend: UpdateUserToSend,
		): Promise<[boolean, string | ReceivedUser]> {
			const response = await update(userId, userToSend);

			if (response.data.hasError) {
				return [ false, response.data?.message || '' ];
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
		async deleteUser(
			userId: number,
		): Promise<[boolean, string | ReceivedUser]> {
			const response = await deleteById(userId);

			if (response.data.hasError) {
				return [ false, response.data.message || '' ];
			}

			this.user = undefined;

			return [ true, response.data.message ];
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
