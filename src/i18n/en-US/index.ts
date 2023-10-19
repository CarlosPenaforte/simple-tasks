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
	},
	REGISTER: {
		SUCCESS: 'User registered successfully',
		USERNAME: {
			VALIDATE: {
				EMPTY: 'The username field is required',
			},
			NAME: 'Username',
		},
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
		GENDER: {
			NOT_INFORMED: 'Not informed',
			NON_BINARY: 'Non-binary',
			MALE: 'Male',
			FEMALE: 'Female',
		},
	},
};
