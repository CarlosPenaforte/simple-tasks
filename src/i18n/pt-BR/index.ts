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
		ERROR: {
			NOT_FOUND: 'Usuário não encontrado',
		},
		GENDER: {
			NOT_INFORMED: 'Não informado',
			NON_BINARY: 'Não-binário',
			MALE: 'Masculino',
			FEMALE: 'Feminino',
		},
		PROFILE: {
			UPDATE: 'Atualizar Perfil',
			UPDATE_SUCCESS: 'Perfil atualizado com sucesso',
		},
	},
	PROJECT: {
		ERROR: {
			CREATE: 'Erro ao criar projeto',
			GET_PROJECTS: 'Erro ao obter projetos',
			CREATE_OR_SELECT_FIRST: 'Crie e/ou selecione um projeto primeiro',
			NAME_ALREADY_EXISTS: 'Já existe um projeto com o nome {name}',
		},
		TITLE: 'Projetos',
		LABEL: 'Projeto',
		CLICK_TO_CREATE: 'Clique aqui para criar um projeto',
		CREATE: 'Criar Projeto',
		FORM: {
			NAME: 'Nome do Projeto',
			DESCRIPTION: 'Descrição do Projeto',
		},
	},
	BRAND: {
		NAME: 'Simple Tasks',
	},
	TASK: {
		ERROR: {
			GET_TASKS: 'Erro ao obter tarefas',
			CREATE: 'Erro ao criar tarefa',
			UPDATE: 'Erro ao atualizar tarefa',
			DELETE: 'Erro ao deletar tarefa',
			SEARCH: 'Erro ao pesquisar tarefas',
			NOT_POSSIBLE_TO_FIND_PROJECT_OR_USER: 'Não foi possível encontrar um projeto e/ou usuário',
			INVALID_DUE_DATE: 'A data de vencimento informada é inválida',
			NOT_FOUND: 'Tarefa não encontrada',
			CHECK: 'Erro ao verificar tarefa',
		},
		SORT: 'Ordenar',
		CREATE: 'Criar Tarefa',
		SEARCH: 'Pesquisar',
		TITLE: 'Tarefas',
		YOUR_TASKS: 'Suas tarefas',
		LABEL: 'Tarefa',
		CONFIRM_DELETE: 'Tem certeza que deseja deletar a tarefa {title}?',
		EDIT: 'Editar Tarefa',
		FORM: {
			TITLE: 'Título da Tarefa',
			DESCRIPTION: 'Descrição da Tarefa',
			URGENCY: 'Urgência',
			DUE_DATE: 'Data de Vencimento',
			DUE_DATE_SUBTITLE: 'Selecione a data de vencimento',
		},
		URGENCY: {
			URGENT: 'Urgente',
			IMPORTANT: 'Importante',
			COMMON: 'Comum',
		},
		DONE: 'Concluída',
		UNTIL: 'Até {dateStr}',
		FINISHED: 'Tarefa {title} concluída',
		UNDONE: 'Tarefa {title} retornou a não concluída',
	},
	COMMON: {
		EDIT: 'Editar',
		DELETE: 'Excluir',
		INTERNAL_ERROR: 'Erro interno',
		LOGOUT: 'Sair',
	},
	SEARCH: {
		TITLE: 'Pesquisar por título',
		URGENCY: 'Pesquisar por urgência',
		DUE_DATE: 'Pesquisar por data de vencimento',
		NOTHING_FOUND: 'Nada encontrado',
	},
	SORT: {
		ASC: 'Crescente',
		DESC: 'Decrescente',
	},
};
