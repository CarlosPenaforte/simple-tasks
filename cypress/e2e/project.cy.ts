const apiUrl: string = Cypress.env('apiUrl');

describe('Project', () => {
	beforeEach(() => {
		cy.login();
		cy.visit('/');
	});
	afterEach(() => {
		cy.logout();
	});

	it('should create a project', () => {
		cy.intercept('POST', `${apiUrl}/api/v1/users/*/projects`).as('createProject');

		cy.get('#btn-create-project').click();

		cy.get('#npt-project-name').type('Test Project');
		cy.get('#npt-project-description').type('Test Description');

		cy.get('#btn-project-submit').click();

		cy.wait('@createProject');
	});
});
