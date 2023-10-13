/* eslint-disable no-console */
import { UserToSend } from 'src/models/apiModels';
import { defineStore } from 'pinia';
import { QVueGlobals } from 'quasar';
import { User } from 'src/models/mainModels';
import {
	login, logout, register,
} from 'src/services/authService';
import { inject } from 'vue';
import {
	formatDateToIso, parseUser,
} from '../utils/commonFunctions';
import { api } from '../boot/axios';

const $q = inject<QVueGlobals>('quasar');

export const useUserStore = defineStore('user', {
	state: () => ({
		user: undefined as User | undefined,
	}),
	actions: {
		async createUser(userToSend : UserToSend): Promise<boolean> {
			const filteredUser = {
				...userToSend,
				birthday: formatDateToIso(new Date(userToSend.birthday)),
			};

			const response = await register(filteredUser);

			if (response.data.hasError) {
				$q?.notify({
					type: 'negative',
					message: response.data.answer,
				});

				return false;
			}

			$q?.notify({
				type: 'positive',
				message: response.data.answer,
			});

			return true;
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
		async login(email: string, password: string): Promise<boolean> {
			const response = await login(email, password);

			if (response.data.token) {
				window.sessionStorage.setItem('simple-tasks/token', response.data.token);

				api.defaults.headers.common.token = response.data.token;
			}

			if (response.status === 200 && response.data.user && response.data.auth) {
				this.user = parseUser(response.data.user);

				return true;
			}

			if (response.status === 403 && response.data.auth === false) {
				$q?.notify({
					type: 'negative',
					message: 'Wrong email or password',
				});

				return false;
			}

			$q?.notify({
				type: 'negative',
				message: 'Something went wrong',
			});

			return false;
		},
		async logout(): Promise<boolean> {
			if (this.user) {
				console.log(this.user?.userId);

				const response = await logout(this.user?.userId);

				this.user = undefined;

				if (response.data.hasError) {
					$q?.notify({
						type: 'negative',
						message: response.data.message,
					});

					return false;
				}

				$q?.notify(response.data.message);
			}

			window.sessionStorage.removeItem('simple-tasks/token');

			this.user = undefined;

			return true;
		},
	},
});
