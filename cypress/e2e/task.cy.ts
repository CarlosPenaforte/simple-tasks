const apiUrl: string = Cypress.env('apiUrl');

describe('Task', () => {
	beforeEach(() => {
		cy.intercept('GET', `${apiUrl}/api/v1/users/*/tasks`).as('getTasks');

		cy.login();
		cy.visit('/');

		cy.wait('@getTasks');
	});

	it('should create a task', () => {
		cy.createProjectIfNeeded();

		cy.intercept('POST', `${apiUrl}/api/v1/users/*/tasks`).as('createTask');

		cy.get('#btn-create-task').click();

		cy.get('#npt-task-title').type('Test Task');
		cy.get('#npt-task-description').type('Test Description');
		cy.get('#npt-task-due-date').type('20122050');

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

	it('should change project and the task shown', () => {
		cy.intercept('GET', `${apiUrl}/api/v1/users/*/tasks`).as('getTasks');

		cy.createProject({
			name: 'Test Project 2', description: 'Test Description',
		});

		cy.get('#npt-select-project').click();
		cy.get('#el-project-option-test-project-2').click();

		cy.get('#el-number-urgent').should('have.text', '0');

		cy.deleteProject({
			name: 'Test Project 2', description: 'Test Description',
		});
		cy.visit('/');

		cy.wait('@getTasks');
	});

	it('should search for a task', () => {
		cy.get('#btn-search-tasks').click();

		cy.get('#npt-search-name').type('Test Task');
		cy.get('#npt-search-due-date').type('20122050');

		cy.get('#btn-apply-search').click();
		cy.get('#el-number-urgent').should('have.text', '1');

		cy.get('#btn-clear-search').click();

		cy.get('#el-number-done').should('be.visible');
	});

	it('should sort tasks', () => {
		cy.intercept('GET', `${apiUrl}/api/v1/users/*/tasks`).as('getTasks');
		cy.intercept('DELETE', `${apiUrl}/api/v1/users/*/tasks/*`).as('deleteTask');
		cy.intercept('POST', `${apiUrl}/api/v1/users/*/tasks`).as('createTask');

		cy.visit('/');
		cy.wait('@getTasks');

		cy.get('#btn-create-task').click();

		cy.get('#npt-task-title').type('Second');
		cy.get('#npt-task-description').type('Test Description');
		cy.get('#npt-task-due-date').type('20122070');

		cy.get('#btn-task-submit').click();

		cy.wait('@createTask');

		cy.get('#btn-sort-tasks').click();

		cy.get('#npt-use-sort-due-date').click();
		cy.get('#npt-orientation-sort-due-date').click();
		cy.get('#el-orientation-due-date-option-descending').click();

		cy.get('#btn-apply-sort').click();

		cy.get('#el-expansion-urgent').click();
		cy.get('#el-expansion-urgent > .q-expansion-item__container >.q-expansion-item__content >.q-list >.q-item').first().should('contain.text', 'Second');

		cy.get('#btn-options-second').click();
		cy.get('#btn-delete-second').click();
		cy.get('#btn-confirm').click();

		cy.wait('@deleteTask');
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
