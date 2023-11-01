/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
import './commands.ts';

type CypressUser = {
    email: string;
    password: string;
}

type SampleProject = {
  name: string;
  description: string;
}

type LoginBody = {
  token: string;
  user_id: string;
}

declare global {
    namespace Cypress {
      interface Chainable {
        login(user?: CypressUser): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getLoginBody(user: CypressUser): LoginBody | Chainable<LoginBody>;
        logout(): void;
        createProject(project?: SampleProject): void;
        createProjectIfNeeded(project?: SampleProject): void;
        deleteProject(project?: SampleProject): void;
        deleteProjectIfNeeded(project?: SampleProject): void;
      }
    }
  }

const installLogCollector = await import('cypress-terminal-report/src/installLogsCollector');
installLogCollector.default();

Cypress.Screenshot.defaults({
	screenshotOnRunFailure: false,
});

// follow the same testing structure as
// https://github.com/cypress-io/cypress-example-conduit-app/tree/master/cypress
//
// move here all the setup for running the tests
// global hook that run after running all the tests

Cypress.on('test:before:run', () => {
	Cypress.automation('remote:debugger:protocol', {
		command: 'Emulation.setLocaleOverride',
		params: {
			locale: 'pt-BR',
		},
	});
});

const apiUrl: string = Cypress.env('apiUrl');

before(() => {
	cy.intercept('GET', `${apiUrl}/api/v1/users/*`).as('getUser');

	cy.login();

	cy.visit('/');

	cy.wait('@getUser');

	cy.deleteProjectIfNeeded();
});

after(() => {
	cy.logout();
});
