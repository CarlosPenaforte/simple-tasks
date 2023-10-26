import { ComposerTranslation } from 'vue-i18n';
import { defineStore } from 'pinia';
import {
	Orientation,
	Task, Urgency,
} from 'src/models/mainModels';
import {
	filterTasksByUrgency, parseTask,
} from 'src/utils/commonFunctions';
import { CreateTaskToSend } from 'src/models/apiModels';
import { SortBy } from '../models/mainModels';
import { parseTaskToSend } from '../utils/commonFunctions';
import {
	create, deleteById, getAll, update,
} from '../services/taskService';
import { useUserStore } from './userStore';
import { useProjectStore } from './projectStore';

export const useTaskStore = defineStore('task', {
	state: () => ({
		tasks: [] as Task[],
		searchedTasks: [] as Task[],
	}),
	actions: {
		async getTasks($t: ComposerTranslation, userId: number): Promise<[boolean, string]> {
			const response = await getAll(userId);

			if (response.data.hasError) {
				if (!response.data.message) {
					return [ false, $t('TASK.ERROR.GET_TASKS') ];
				}
				return [ false, response.data.message ];
			}

			if (response.data.tasks === undefined) {
				return [ false, $t('TASK.ERROR.NOTHING_FOUND') ];
			}

			this.tasks = response.data.tasks.map(parseTask);

			return [ true, $t('TASK.SUCCESS.GET') ];
		},
		async createTask(
			$t: ComposerTranslation,
			userId: number,
			taskToSend: CreateTaskToSend,
		): Promise<[boolean, string]> {
			const response = await create(userId, taskToSend);

			if (response.data.hasError) {
				if (!response.data?.message) {
					return [ false, $t('TASK.ERROR.CREATE') ];
				}
				return [ false, response.data.message ];
			}

			if (response.data.tasks === undefined) {
				return [ false, $t('TASK.ERROR.NOTHING_FOUND') ];
			}

			this.tasks = response.data.tasks.map(parseTask);

			this.tasks = this.tasks.sort((a, b) => a.taskId - b.taskId);

			return [ true, $t('TASK.SUCCESS.CREATE') ];
		},
		async updateTask(
			$t: ComposerTranslation,
			userId: number,
			taskId: number,
			taskToSend: CreateTaskToSend,
		): Promise<[boolean, string]> {
			const response = await update(userId, taskId, taskToSend);

			if (response.data.hasError) {
				if (!response.data?.message) {
					return [ false, $t('TASK.ERROR.UPDATE') ];
				}
				return [ false, response.data.message ];
			}

			if (response.data.task === undefined) {
				return [ false, $t('TASK.ERROR.NOTHING_FOUND') ];
			}

			this.tasks = this.tasks.map((task) => {
				if (task.taskId === response.data.task?.task_id) {
					return parseTask(response.data.task);
				}

				return task;
			});

			this.tasks = this.tasks.sort((a, b) => a.taskId - b.taskId);

			return [ true, $t('TASK.SUCCESS.UPDATE') ];
		},
		async checkTask(
			$t: ComposerTranslation,
			userId: number,
			taskId: number,
			checked: boolean,
		): Promise<[boolean, string]> {
			const foundTask = this.tasks.find((task) => task.taskId === taskId);

			if (!foundTask) {
				return [ false, $t('TASK.ERROR.NOT_FOUND') ];
			}

			const response = await update(userId, taskId, parseTaskToSend(foundTask));

			if (response.data.hasError) {
				if (!response.data?.message) {
					return [ false, $t('TASK.ERROR.CHECK') ];
				}
				return [ false, response.data.message ];
			}

			foundTask.done = checked;

			return [ true, $t('TASK.SUCCESS.CHECK') ];
		},
		setTasks(tasks: Task[]) {
			this.tasks = tasks;
		},
		searchTasks(name: string, urgency: Urgency, date: Date | undefined): boolean {
			this.searchedTasks = this.tasks.filter((task) => {
				if (name && !task.taskTitle.includes(name)) {
					return false;
				}

				if (date && task.dueDate && task.dueDate.getTime() !== date.getTime()) {
					return false;
				}

				if (task.urgency !== urgency) {
					return false;
				}

				return true;
			});

			return this.searchedTasks.length > 0;
		},
		sortTasks(sortBy: SortBy) {
			this.searchedTasks = [];
			this.tasks = this.tasks.sort((a, b) => {
				if (sortBy.dueDate.use) {
					if (a.dueDate && b.dueDate) {
						if (a.dueDate.getTime() > b.dueDate.getTime()) {
							return sortBy.dueDate.orientation === Orientation.ASC ? 1 : -1;
						}
						if (a.dueDate.getTime() < b.dueDate.getTime()) {
							return sortBy.dueDate.orientation === Orientation.ASC ? -1 : 1;
						}
					}
				}

				if (sortBy.name.use) {
					if (a.taskTitle > b.taskTitle) {
						return sortBy.name.orientation === Orientation.ASC ? 1 : -1;
					}
					if (a.taskTitle < b.taskTitle) {
						return sortBy.name.orientation === Orientation.ASC ? -1 : 1;
					}
				}

				return 0;
			});
		},
		clearSearchedTasks() {
			this.searchedTasks = [];
		},
		async deleteTask($t: ComposerTranslation, userId: number, taskId: number): Promise<[boolean, string]> {
			const response = await deleteById(userId, taskId);

			if (response.data.hasError) {
				if (!response.data.message) {
					return [ false, $t('TASK.ERROR.DELETE') ];
				}
				return [ false, response.data.message ];
			}

			this.tasks = this.tasks.filter((task) => task.taskId !== taskId);

			return [ true, response.data.message ];
		},
	},
	getters: {
		undoneTasks(): Task[] {
			return this.tasks.filter((task) => !task.done
				&& useUserStore().$state.user?.userId === task.userId
				&& useProjectStore().$state.currentProject?.projectId === task.projectId);
		},

		doneTasks(): Task[] {
			return this.tasks.filter((task) => task.done
				&& useUserStore().$state.user?.userId === task.userId
				&& useProjectStore().$state.currentProject?.projectId === task.projectId);
		},

		urgentTasks(): Task[] {
			const userId = useUserStore().$state.user?.userId;
			if (!userId) return [];

			const projectId = useProjectStore().$state.currentProject?.projectId;
			if (!projectId) return [];

			return filterTasksByUrgency(userId, projectId, this.tasks, Urgency.URGENT);
		},
		importantTasks(): Task[] {
			const userId = useUserStore().$state.user?.userId;
			if (!userId) return [];

			const projectId = useProjectStore().$state.currentProject?.projectId;
			if (!projectId) return [];

			return filterTasksByUrgency(userId, projectId, this.tasks, Urgency.IMPORTANT);
		},
		commonTasks(): Task[] {
			const userId = useUserStore().$state.user?.userId;
			if (!userId) return [];

			const projectId = useProjectStore().$state.currentProject?.projectId;
			if (!projectId) return [];

			return filterTasksByUrgency(userId, projectId, this.tasks, Urgency.COMMON);
		},
	},
});
