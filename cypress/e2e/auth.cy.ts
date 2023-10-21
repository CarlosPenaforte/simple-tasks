describe('Auth', () => {
	beforeEach(() => {
		cy.login();
		cy.visit('/');
	});

	it('should login', () => {
		cy.get('#btn-login-action').should('be.visible');
	});
});
