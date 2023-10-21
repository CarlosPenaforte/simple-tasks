/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
import './commands.ts';

interface CypressUser {
    email: string;
    password: string;
}

interface LoginBody {
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
      }
    }
  }

import 'cypress-terminal-report/src/installLogsCollector';

Cypress.Screenshot.defaults({
	screenshotOnRunFailure: false,
});

// follow the same testing structure as
// https://github.com/cypress-io/cypress-example-conduit-app/tree/master/cypress
//
// move here all the setup for running the tests
// global hook that run after running all the tests

after(() => {
	cy.logout();
});
