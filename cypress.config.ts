import { defineConfig } from 'cypress';

export default defineConfig({
	video: false,
	chromeWebSecurity: false,
	env: {
		user: {
			email: 'test@simpletasks.com.br',
			password: '123456',
		},
	},
	defaultCommandTimeout: 10000,
	e2e: {
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		setupNodeEvents(on, config) {
			// eslint-disable-next-line global-require
			return require('./cypress/plugins/index.js')(on, config);
		},
		baseUrl: 'http://localhost:9000',
	},
});
