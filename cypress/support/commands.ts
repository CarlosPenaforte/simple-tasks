const apiUrl = Cypress.env('apiUrl');

Cypress.Commands.add('getLoginBody', (user = Cypress.env('user')) => {
	const token = sessionStorage.getItem('simple-tasks/token');
	const userId = sessionStorage.getItem('simple-tasks/user_id');
	if (!token || !userId) {
		return cy
			.request({
				method: 'POST',
				url: `${apiUrl}/auth/login`,
				body: {
					email: user.email,
					password: user.password,
				},
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			})
			.then((receivedToken) => {
				const { body } = receivedToken;
				sessionStorage.setItem(
					'simple-tasks/token',
					body.token,
				);
				sessionStorage.setItem(
					'simple-tasks/user_id',
					String(body.user.user_id),
				);
				return receivedToken;
			})
			.its('body')
			.should('exist');
	}

	return {
		token, user_id: userId,
	};
});

Cypress.Commands.add('login', (user = Cypress.env('user')) => {
	if (!sessionStorage.getItem('simple-tasks/token')) {
		(cy.getLoginBody(user) as Cypress.Chainable).then((body) => {
			sessionStorage.setItem('simple-tasks/token', body.token);
			sessionStorage.setItem('simple-tasks/user_id', String(body.user.user_id));
		});
	}
});

Cypress.Commands.add('logout', () => {
	sessionStorage.removeItem('simple-tasks/token');
	sessionStorage.removeItem('simple-tasks/user_id');
});
