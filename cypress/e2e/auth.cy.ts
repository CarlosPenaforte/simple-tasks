describe('Auth', () => {
	beforeEach(() => {
		cy.login();
		cy.visit('/');
	});

	it('should login', () => {
		cy.get('#el-main-layout').should('be.visible');
	});
});
