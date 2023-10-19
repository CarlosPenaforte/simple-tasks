import { defineStore } from 'pinia';
import {
	Task, Urgency,
} from 'src/models/mainModels';
import {
	filterTasksByUrgency, parseTask,
} from 'src/utils/commonFunctions';
import { CreateTaskToSend } from 'src/models/apiModels';
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
		async getTasks(userId: number): Promise<[boolean, string]> {
			const response = await getAll(userId);

			if (response.data.hasError) {
				if (!response.data.message) {
					return [ false, 'Error while getting tasks' ];
				}
				return [ false, response.data.message ];
			}

			if (response.data.tasks === undefined) {
				return [ false, 'No tasks found' ];
			}

			this.tasks = response.data.tasks.map(parseTask);

			return [ true, 'Success getting tasks' ];
		},
		async createTask(userId: number, taskToSend: CreateTaskToSend): Promise<[boolean, string]> {
			const response = await create(userId, taskToSend);

			if (response.data.hasError) {
				if (!response.data?.message) {
					return [ false, 'Error while creating task' ];
				}
				return [ false, response.data.message ];
			}

			if (response.data.tasks === undefined) {
				return [ false, 'No tasks found' ];
			}

			this.tasks = response.data.tasks.map(parseTask);

			this.tasks = this.tasks.sort((a, b) => a.taskId - b.taskId);

			return [ true, 'Success creating task' ];
		},
		async updateTask(userId: number, taskId: number, taskToSend: CreateTaskToSend): Promise<[boolean, string]> {
			const response = await update(userId, taskId, taskToSend);

			if (response.data.hasError) {
				if (!response.data?.message) {
					return [ false, 'Error while updating task' ];
				}
				return [ false, response.data.message ];
			}

			if (response.data.task === undefined) {
				return [ false, 'No tasks found' ];
			}

			this.tasks = this.tasks.map((task) => {
				if (task.taskId === response.data.task?.task_id) {
					return parseTask(response.data.task);
				}

				return task;
			});

			this.tasks = this.tasks.sort((a, b) => a.taskId - b.taskId);

			return [ true, 'Success updating task' ];
		},
		async checkTask(userId: number, taskId: number, checked: boolean): Promise<[boolean, string]> {
			const foundTask = this.tasks.find((task) => task.taskId === taskId);

			if (!foundTask) {
				return [ false, 'Task not found' ];
			}

			foundTask.done = checked;

			const response = await update(userId, taskId, parseTaskToSend(foundTask));

			if (response.data.hasError) {
				if (!response.data?.message) {
					return [ false, 'Error while checking task' ];
				}
				return [ false, response.data.message ];
			}

			if (response.data.task === undefined) {
				return [ false, 'No tasks found' ];
			}

			this.tasks = this.tasks.map((task) => {
				if (task.taskId === response.data.task?.task_id) {
					return parseTask(response.data.task);
				}

				return task;
			});

			this.tasks = this.tasks.sort((a, b) => a.taskId - b.taskId);

			return [ true, 'Success checking task' ];
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
		clearSearchedTasks() {
			this.searchedTasks = [];
		},
		async deleteTask(userId: number, taskId: number): Promise<[boolean, string]> {
			const response = await deleteById(userId, taskId);

			if (response.data.hasError) {
				if (!response.data.message) {
					return [ false, 'Error while deleting task' ];
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
