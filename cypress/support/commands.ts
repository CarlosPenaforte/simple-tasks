const apiUrl: string = Cypress.env('apiUrl');

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

Cypress.Commands.add('createProject', (project = Cypress.env('sampleProject')) => {
	cy.intercept('POST', `${apiUrl}/api/v1/users/*/projects`).as('createProject');

	cy.get('#btn-create-project').click();

	cy.get('#npt-project-name').type(project.name);
	cy.get('#npt-project-description').type(project.description);

	cy.get('#btn-project-submit').click();

	cy.wait('@createProject', { timeout: 10000 });
});

Cypress.Commands.add('createProjectIfNeeded', (project = Cypress.env('sampleProject')) => {
	cy.get('body').then(($body) => {
		if ($body.find('#el-no-project').length) {
			cy.createProject(project);
		} else {
			cy.end();
		}
	});
});

Cypress.Commands.add('deleteProject', (project = Cypress.env('sampleProject')) => {
	cy.intercept('DELETE', `${apiUrl}/api/v1/users/*/projects/*`).as('deleteProject');

	cy.visit('/#/projects');

	cy.contains(project.name, { matchCase: false }).click();

	cy.get('#btn-delete-project').click();

	cy.get('#btn-confirm').click();

	cy.wait('@deleteProject', { timeout: 10000 });

	cy.contains(project.name, { matchCase: false }).should('not.exist');
});

Cypress.Commands.add('deleteProjectIfNeeded', (project = Cypress.env('sampleProject')) => {
	cy.get('body').then(($body) => {
		if (!$body.find('#el-no-project').length) {
			cy.deleteProject(project);
		} else {
			cy.end();
		}
	});
});
