const apiUrl: string = Cypress.env('apiUrl');
const sampleProject = Cypress.env('sampleProject');

describe('Project', () => {
	beforeEach(() => {
		cy.login();
		cy.visitPt('/');
	});
	afterEach(() => {
		cy.logout();
	});

	it('should create a project', () => {
		cy.createProject();
	});

	it('should update a project', () => {
		cy.intercept('GET', `${apiUrl}/api/v1/users/*/projects`).as('getProjects');
		cy.intercept('PUT', `${apiUrl}/api/v1/users/*/projects/*`).as('updateProject');

		cy.visitPt('/#/projects');
		cy.wait('@getProjects');

		cy.contains(sampleProject.name, { matchCase: false }).click();

		cy.get('#btn-update-project').click();
		cy.get('#npt-project-description').clear();
		cy.get('#npt-project-description').type('Updated Test Project');

		cy.get('#btn-project-submit').click();

		cy.wait('@updateProject', { timeout: 10000 });
	});

	it('should delete a project', () => {
		cy.deleteProject();
	});
});
