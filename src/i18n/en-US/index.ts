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
				INVALID: 'The password entered is invalid',
				CONFIRM_INVALID: 'The passwords entered do not match',
			},
			NAME: 'Password',
		},
		USERNAME: {
			VALIDATE: {
				EMPTY: 'The username field is required',
			},
			NAME: 'Username',
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
		},
		FORM: {
			INVALID_FIELDS: 'There are invalid fields',
			BUTTONS: {
				LOGIN: 'Login',
				REGISTER: 'Register',
			},
		},
		WRONG_CREDENTIALS: 'Wrong email or password',
	},
};
