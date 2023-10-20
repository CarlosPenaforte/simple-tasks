export default {
	AUTH: {
		EMAIL: {
			VALIDATE: {
				EMPTY: 'The email field is required',
				INVALID: 'The email entered is invalid',
			},
			NAME: 'Email',
		},
		PASSWORD: {
			VALIDATE: {
				EMPTY: 'The password field is required',
				LENGTH: 'The password must be at least 6 characters',
			},
			NAME: 'Password',
		},
		FORM: {
			INVALID_FIELDS: 'There are invalid fields',
			BUTTONS: {
				LOGIN: 'Login',
				REGISTER: 'Register',
			},
		},
		WRONG_CREDENTIALS: 'Wrong email or password',
		SUCCESS: 'Login successful',
	},
	REGISTER: {
		SUCCESS: 'User registered successfully',
		FULL_NAME: {
			VALIDATE: {
				EMPTY: 'The full name field is required',
			},
			NAME: 'Full name',
		},
		GENDER: {
			VALIDATE: {
				EMPTY: 'The gender field is required',
			},
			NAME: 'Gender',
		},
		BIRTHDAY: {
			VALIDATE: {
				EMPTY: 'The birthday field is required',
				INVALID: 'The birthday entered is invalid',
			},
			NAME: 'Birthday',
			SUBTITLE: 'Select your birthday',
		},
		CONFIRM_PASSWORD: {
			VALIDATE: {
				EMPTY: 'The confirm password field is required',
				MATCH: 'The passwords entered do not match',
			},
			NAME: 'Confirm Password',
		},
	},
	USER: {
		ERROR: {
			NOT_FOUND: 'User not found',
		},
		GENDER: {
			NOT_INFORMED: 'Not informed',
			NON_BINARY: 'Non-binary',
			MALE: 'Male',
			FEMALE: 'Female',
		},
		PROFILE: {
			UPDATE: 'Update Profile',
			UPDATE_SUCCESS: 'Profile updated successfully',
		},
	},
	PROJECT: {
		ERROR: {
			CREATE: 'Error creating project',
			DELETE: 'Error deleting project',
			NOT_FOUND: 'Project not found',
			GET_PROJECTS: 'Error getting projects',
			NOTHING_FOUND: 'No projects found',
			NAME_ALREADY_EXISTS: 'A project with the name {name} already exists',
			CREATE_OR_SELECT_FIRST: 'Create and/or select a project first',
		},
		SUCCESS: {
			CREATE: 'Project created successfully',
			DELETE: 'Project deleted successfully',
			GET: 'Projects obtained successfully',
			UPDATE: 'Project updated successfully',
		},
		TITLE: 'Projects',
		LABEL: 'Project',
		CLICK_TO_CREATE: 'Click here to create a project',
		CREATE: 'Create Project',
		DELETE: 'Delete Project',
		CONFIRM_DELETE: 'Are you sure you want to delete the project {name}?',
		NOTHING: 'There is no project created. Create one to start using the app',
		FORM: {
			NAME: 'Project Name',
			DESCRIPTION: 'Project Description',
			DESCRIPTION_SHORT: 'Description',
		},
	},
	BRAND: {
		NAME: 'Simple Tasks',
	},
	TASK: {
		ERROR: {
			GET_TASKS: 'Error getting tasks',
			CREATE: 'Error creating task',
			UPDATE: 'Error updating task',
			DELETE: 'Error deleting task',
			SEARCH: 'Error searching tasks',
			NOTHING_FOUND: 'No tasks found',
			NOT_POSSIBLE_TO_FIND_PROJECT_OR_USER: 'It was not possible to find a project and/or user',
			INVALID_DUE_DATE: 'The due date entered is invalid',
			NOT_FOUND: 'Task not found',
			CHECK: 'Error checking task',
		},
		SUCCESS: {
			CREATE: 'Task created successfully',
			DELETE: 'Task deleted successfully',
			GET: 'Tasks obtained successfully',
			UPDATE: 'Task updated successfully',
			CHECK: 'Task checked successfully',
		},
		SORT: 'Sort',
		CREATE: 'Create Task',
		SEARCH: 'Search',
		TITLE: 'Tasks',
		YOUR_TASKS: 'Your Tasks',
		LABEL: 'Task',
		CONFIRM_DELETE: 'Are you sure you want to delete the task {title}?',
		EDIT: 'Edit Task',
		FORM: {
			TITLE: 'Task Title',
			DESCRIPTION: 'Task Description',
			URGENCY: 'Urgency',
			DUE_DATE: 'Due Date',
			DUE_DATE_SUBTITLE: 'Select the due date',
		},
		URGENCY: {
			URGENT: 'Urgent',
			IMPORTANT: 'Important',
			COMMON: 'Common',
		},
		DONE: 'Done',
		UNTIL: 'Until {dateStr}',
		FINISHED: 'Task {title} finished',
		UNDONE: 'Task {title} returned to undone',
	},
	COMMON: {
		EDIT: 'Edit',
		DELETE: 'Delete',
		INTERNAL_ERROR: 'Internal error',
		LOGOUT: 'Logout',
	},
	SEARCH: {
		TITLE: 'Search by title',
		URGENCY: 'Search by urgency',
		DUE_DATE: 'Search by due date',
		NOTHING_FOUND: 'Nothing found',
		DISMISS: 'Showing search<br>Click here to dismiss',
	},
	SORT: {
		ASC: 'Ascending',
		DESC: 'Descending',
	},
	NOT_FOUND_PAGE: {
		SUBTITLE: 'Oops. Nothing here...',
		GO_HOME: 'Go Home',
	},
};
