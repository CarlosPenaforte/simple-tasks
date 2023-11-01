const path = require('path');

const envFile = '.env.test';

require('dotenv').config({ path: path.resolve(process.cwd(), envFile) });
/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

module.exports = (on, config) => {
	// `on` is used to hook into various events Cypress emits
	// `config` is the resolved Cypress config

	// eslint-disable-next-line global-require
	require('cypress-terminal-report/src/installLogsPrinter')(on);

	const API_URL = process.env.API_BASE_URL;

	config.env.apiUrl = (API_URL) || 'http://localhost:3000';

	return config;
};
