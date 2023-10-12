import { defineStore } from 'pinia';
import {
	Task, Urgency,
} from 'src/models/mainModels';
import { filterTasksByUrgency } from 'src/utils/commonFunctions';

export const useTaskStore = defineStore('task', {
	state: () => ({
		tasks: [
			{
				taskId: 1,
				userId: 1,
				projectId: 1,
				taskTitle: 'ct1',
				taskDescription: 'ok',
				creationDate: new Date(),
				urgency: Urgency.URGENT,
				done: false,
			},
			{
				taskId: 2,
				userId: 1,
				projectId: 2,
				taskTitle: 'ct1',
				taskDescription: 'ok',
				creationDate: new Date(),
				dueDate: new Date('2022-11-30'),
				urgency: Urgency.URGENT,
				done: false,
			},
			{
				taskId: 3,
				userId: 1,
				projectId: 1,
				taskTitle: 'ct1',
				taskDescription: 'ok',
				creationDate: new Date(),
				urgency: Urgency.IMPORTANT,
				done: false,
			},
			{
				taskId: 4,
				userId: 1,
				projectId: 3,
				taskTitle: 'ct1',
				taskDescription: 'ok',
				creationDate: new Date(),
				urgency: Urgency.IMPORTANT,
				done: false,
			},
			{
				taskId: 5,
				userId: 1,
				projectId: 1,
				taskTitle: 'ct1',
				taskDescription: 'ok',
				creationDate: new Date(),
				urgency: Urgency.COMMON,
				done: false,
			},
		] as Task[],
	}),
	actions: {
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
