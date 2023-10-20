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
				LENGTH: 'A senha deve ter pelo menos 6 caracteres',
			},
			NAME: 'Senha',
		},
		WRONG_CREDENTIALS: 'Email e/ou senha incorreto(s)',
	},
	FORM: {
		INVALID_FIELDS: 'Existem campos inválidos',
		BUTTONS: {
			LOGIN: 'Login',
			REGISTER: 'Cadastrar',
		},
	},
	REGISTER: {
		SUCCESS: 'Usuário cadastrado com sucesso',
		FULL_NAME: {
			VALIDATE: {
				EMPTY: 'O campo nome completo é obrigatório',
			},
			NAME: 'Nome completo',
		},
		GENDER: {
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
			SUBTITLE: 'Selecione sua data de nascimento',
		},
		CONFIRM_PASSWORD: {
			VALIDATE: {
				EMPTY: 'O campo confirmar senha é obrigatório',
				MATCH: 'As senhas informadas não conferem',
			},
			NAME: 'Confirmar senha',
		},
	},
	USER: {
		GENDER: {
			NOT_INFORMED: 'Não informado',
			NON_BINARY: 'Não-binário',
			MALE: 'Masculino',
			FEMALE: 'Feminino',
		},
	},
};
