import { defineStore } from 'pinia';
import {
	Task, Urgency,
} from 'src/models/mainModels';
import {
	filterTasksByUrgency, parseTask,
} from 'src/utils/commonFunctions';
import { getAll } from '../services/taskService';

export const useTaskStore = defineStore('task', {
	state: () => ({
		tasks: [] as Task[],
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
		createTask(task : Task) {
			this.tasks.push(task);

			this.tasks = this.tasks.sort((a, b) => a.taskId - b.taskId);
		},
		updateTask(newTask : Task) {
			this.tasks = this.tasks.map((task) => {
				if (task.taskId === newTask.taskId) {
					return newTask;
				}
				return task;
			});
		},
		setTasks(tasks: Task[]) {
			this.tasks = tasks;
		},
		removeTask(taskId: number) {
			this.tasks = this.tasks.filter((task) => !(task.taskId === taskId));
		},
	},
	getters: {
		undoneTasks(): Task[] {
			return this.tasks.filter((task) => !task.done);
		},

		doneTasks(): Task[] {
			return this.tasks.filter((task) => task.done);
		},

		urgentTasks(): Task[] {
			return filterTasksByUrgency(this.tasks, Urgency.URGENT);
		},
		importantTasks(): Task[] {
			return filterTasksByUrgency(this.tasks, Urgency.IMPORTANT);
		},
		commonTasks(): Task[] {
			return filterTasksByUrgency(this.tasks, Urgency.COMMON);
		},
	},
});
