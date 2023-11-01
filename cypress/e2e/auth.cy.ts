const apiUrl: string = Cypress.env('apiUrl');

describe('Authentication', () => {
	beforeEach(() => {
		cy.intercept('GET', `${apiUrl}/api/v1/users/*`).as('getUser');

		cy.login();
		cy.visit('/');

		cy.wait('@getUser');
	});
	afterEach(() => {
		cy.logout();
	});

	it('should view tasks layout after login', () => {
		cy.get('#el-main-layout').should('be.visible');
	});
});
