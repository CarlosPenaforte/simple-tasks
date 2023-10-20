describe('Auth', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('should login', () => {
		cy.get('#btn-login-action').should('be.visible');
	});
});
