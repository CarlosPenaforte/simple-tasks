import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('src/layouts/TasksLayout.vue'),
		children: [
			{
				path: '',
				component: () => import('src/pages/SelfTasks.vue'),
			},
			{
				path: 'profile',
				component: () => import('src/pages/ProfilePage.vue'),
			},
		],
	},

	{
		path: '/login',
		component: () => import('src/layouts/LoginLayout.vue'),
		children: [
			{
				path: '',
				component: () => import('src/pages/LoginPage.vue'),
			},
			{
				path: '/register',
				component: () => import('src/pages/RegisterPage.vue'),
			},
		],
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue'),
	},
];

export default routes;
