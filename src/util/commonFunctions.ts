import {
  Task, Urgency,
} from '../components/models';

export function filterTasksByUrgency (tasks: Task[], urgency: Urgency): Task[] {
  return tasks.filter((task) => task.urgency === urgency);
}
