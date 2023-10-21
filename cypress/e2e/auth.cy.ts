describe('Authentication', () => {
	beforeEach(() => {
		cy.login();
		cy.visit('/');
	});
	afterEach(() => {
		cy.logout();
	});

	it('should view tasks layout after login', () => {
		cy.get('#el-main-layout').should('be.visible');
	});
});
