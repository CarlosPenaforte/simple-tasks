const apiUrl: string = Cypress.env('apiUrl');

describe('Task', () => {
	beforeEach(() => {
		cy.intercept('GET', `${apiUrl}/api/v1/users/*`).as('getUser');
		cy.intercept('GET', `${apiUrl}/api/v1/users/*/projects`).as('getProjects');
		cy.intercept('GET', `${apiUrl}/api/v1/users/*/tasks`).as('getTasks');

		cy.login();
		cy.visit('/');

		cy.wait('@getUser');
		cy.wait('@getProjects');
		cy.wait('@getTasks');
	});

	it('should create a task', () => {
		cy.createProjectIfNeeded();

		cy.intercept('POST', `${apiUrl}/api/v1/users/*/tasks`).as('createTask');

		cy.get('#btn-create-task').click();

		cy.get('#npt-task-title').type('Test Task');
		cy.get('#npt-task-description').type('Test Description');
		cy.get('#npt-task-due-date').type('20122023');

		cy.get('#btn-task-submit').click();

		cy.wait('@createTask');
	});

	it('should update a task', () => {
		cy.intercept('PUT', `${apiUrl}/api/v1/users/*/tasks/*`).as('updateTask');

		cy.get('#el-expansion-urgent').click();
		cy.get('#btn-options-test-task').click();
		cy.get('#btn-edit-test-task').click();

		cy.get('#npt-task-description').clear();
		cy.get('#npt-task-description').type('Updated Test Task');

		cy.get('#btn-task-submit').click();

		cy.wait('@updateTask');
	});

	it('should show warn if due date was reached a task', () => {
		cy.intercept('PUT', `${apiUrl}/api/v1/users/*/tasks/*`).as('updateTask');

		cy.get('#el-expansion-urgent').click();
		cy.get('#btn-options-test-task').click();
		cy.get('#btn-edit-test-task').click();

		cy.get('#npt-task-due-date').clear();
		cy.get('#npt-task-due-date').type('20122020');

		cy.get('#btn-task-submit').click();

		cy.wait('@updateTask');

		cy.contains('20/12/2020').should('have.class', 'text-negative');
	});

	it('should check a task', () => {
		cy.intercept('PUT', `${apiUrl}/api/v1/users/*/tasks/*`).as('updateTask');

		cy.get('#el-expansion-urgent').click();
		cy.get('#btn-check-test-task').click();

		cy.wait('@updateTask');

		cy.get('#el-expansion-urgent').click();
		cy.get('#el-expansion-done').click();
		cy.contains('Test Task', { matchCase: false }).should('be.visible');
	});

	it('should delete a task', () => {
		cy.intercept('DELETE', `${apiUrl}/api/v1/users/*/tasks/*`).as('deleteTask');

		cy.get('#el-expansion-done').click();
		cy.get('#btn-options-test-task').click();
		cy.get('#btn-delete-test-task').click();

		cy.get('#btn-confirm').click();

		cy.wait('@deleteTask');

		cy.deleteProjectIfNeeded();
	});
});
