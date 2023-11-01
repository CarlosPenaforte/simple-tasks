const apiUrl: string = Cypress.env('apiUrl');

describe('Project', () => {
	beforeEach(() => {
		cy.intercept('GET', `${apiUrl}/api/v1/users/*`).as('getUser');

		cy.login();
		cy.visitPt('/');

		cy.wait('@getUser');
	});
	afterEach(() => {
		cy.logout();
	});

	it('should register an user', () => {
		cy.intercept('POST', `${apiUrl}/api/v1/users`).as('registerUser');
		cy.logout();
		cy.visitPt('/#/login');

		cy.get('#btn-register-route').click();

		cy.get('#npt-register-email').type('test@test.com');
		cy.get('#npt-register-full-name').type('Test 2');
		cy.get('#npt-register-gender').click();
		cy.get('#el-gender-option-male').click();
		cy.get('#npt-register-birthday').type('26081999');
		cy.get('#npt-register-password').type('123456');
		cy.get('#npt-register-confirm-password').type('123456');

		cy.get('#btn-register-action').click();

		cy.wait('@registerUser', { timeout: 10000 });
	});

	it('should delete an user', () => {
		cy.logout();
		cy.visitPt('/#/login');

		cy.intercept('GET', `${apiUrl}/api/v1/users/*`).as('getUser');
		cy.intercept('DELETE', `${apiUrl}/api/v1/users/*`).as('deleteUser');

		cy.login({
			email: 'test@test.com', password: '123456',
		});

		cy.visitPt('/');
		cy.wait('@getUser', { timeout: 10000 });

		cy.visitPt('/#/profile');

		cy.get('.info-value').first().should('contain.text', 'Test 2');

		cy.get('#btn-delete-user').click();
		cy.get('#btn-confirm').click();

		cy.wait('@deleteUser', { timeout: 10000 });
	});

	it('should update the user', () => {
		cy.intercept('PUT', `${apiUrl}/api/v1/users/*`).as('updateUser');

		cy.visitPt('/#/profile');

		cy.get('#btn-update-profile').click();
		cy.get('#npt-user-full-name').clear();
		cy.get('#npt-user-full-name').type('Test');

		cy.get('#btn-user-submit').click();

		cy.wait('@updateUser', { timeout: 10000 });
	});
});
