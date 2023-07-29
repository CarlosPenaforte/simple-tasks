import { defineStore } from 'pinia';
import {
	Task, Urgency,
} from 'src/models';

export const useTaskStore = defineStore('task', {
	state: () => ({
		tasks: [
			{
				taskId: 1,
				userId: 1,
				projectId: 1,
				title: 'ct1',
				description: 'ok',
				creationDate: new Date(),
				urgency: Urgency.URGENT,
				done: false,
			},
			{
				taskId: 2,
				userId: 1,
				projectId: 2,
				title: 'ct1',
				description: 'ok',
				creationDate: new Date(),
				dueDate: new Date('2022-11-30'),
				urgency: Urgency.URGENT,
				done: false,
			},
			{
				taskId: 3,
				userId: 1,
				projectId: 1,
				title: 'ct1',
				description: 'ok',
				creationDate: new Date(),
				urgency: Urgency.IMPORTANT,
				done: false,
			},
			{
				taskId: 4,
				userId: 1,
				projectId: 3,
				title: 'ct1',
				description: 'ok',
				creationDate: new Date(),
				urgency: Urgency.IMPORTANT,
				done: false,
			},
			{
				taskId: 5,
				userId: 1,
				projectId: 1,
				title: 'ct1',
				description: 'ok',
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
});
