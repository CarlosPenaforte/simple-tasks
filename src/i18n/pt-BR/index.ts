export default {
	AUTH: {
		EMAIL: {
			VALIDATE: {
				EMPTY: 'O campo email é obrigatório',
				INVALID: 'O email informado é inválido',
			},
			NAME: 'Email',
		},
		PASSWORD: {
			VALIDATE: {
				EMPTY: 'O campo senha é obrigatório',
				INVALID: 'A senha informada é inválida',
				CONFIRM_INVALID: 'As senhas informadas não conferem',
			},
			NAME: 'Senha',
		},
		USERNAME: {
			VALIDATE: {
				EMPTY: 'O campo usuário é obrigatório',
			},
			NAME: 'Usuário',
		},
		SEX: {
			VALIDATE: {
				EMPTY: 'O campo sexo é obrigatório',
			},
			NAME: 'Sexo',
		},
		BIRTHDAY: {
			VALIDATE: {
				EMPTY: 'O campo data de nascimento é obrigatório',
				INVALID: 'A data de nascimento informada é inválida',
			},
			NAME: 'Data de nascimento',
		},
		FORM: {
			INVALID_FIELDS: 'Existem campos inválidos',
			BUTTONS: {
				LOGIN: 'Login',
				REGISTER: 'Cadastrar',
			},
		},
		WRONG_CREDENTIALS: 'Email e/ou senha incorreto(s)',
	},
};
