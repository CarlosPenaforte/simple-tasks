import {
	Task, Urgency,
} from '../models/mainModels';

export function filterTasksByUrgency(tasks: Task[], urgency: Urgency): Task[] {
	return tasks.filter((task) => task.urgency === urgency);
}

export const isTask = (task: Task | undefined): task is Task => !!task;
