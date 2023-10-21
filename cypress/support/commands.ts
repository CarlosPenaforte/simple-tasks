const apiUrl = Cypress.env('apiUrl');

Cypress.Commands.add('getLoginToken', (user = Cypress.env('user')) => {
	const token = sessionStorage.getItem('simple-tasks/token');
	if (!token) {
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
					JSON.stringify(body.token),
				);
				sessionStorage.setItem(
					'simple-tasks/user_id',
					JSON.stringify(body.user.user_id),
				);
				return receivedToken;
			})
			.its('body.token')
			.should('exist');
	}
	return token;
});

Cypress.Commands.add('login', (user = Cypress.env('user')) => {
	if (!sessionStorage.getItem('simple-tasks/token')) {
		if (typeof cy.getLoginToken(user) === 'string') {
			sessionStorage.setItem('simple-tasks/token', JSON.stringify(cy.getLoginToken(user)));
			return;
		}
		(cy.getLoginToken(user) as Cypress.Chainable).then((token) => {
			sessionStorage.setItem('simple-tasks/token', JSON.stringify(token));
		});
	}
});
