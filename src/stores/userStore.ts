/* eslint-disable no-console */
import { defineStore } from 'pinia';
import {
	User, Gender,
} from 'src/models';

export const useUserStore = defineStore('user', {
	state: () => ({
		user: {
			userId: 1,
			username: 'ricardin09',
			fullName: 'Ricardo Sales',
			email: 'ricardin09@gmail.com',
			sex: Gender.MALE,
			birthday: new Date(Date.parse('20/12/2000')),
		} as User | undefined,
	}),
	actions: {
		createUser(user : User) {
			console.log(user);

			// aqui virá uma requisição para registrar um usuário

			// se der certo
			this.user = user;
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
		login(email: string, password: string) {
			console.log(email, password);
			// requisição para pegar os dados do usuário
			// Se a combinação email-senha estiver correta, então o usuário é passado
			// Se estiver errada, uma mensagem de erro será exposta ao usuário
		},
		logout() {
			console.log('logging out');

			// Requisição para logout

			this.user = undefined;
		},
	},
});
