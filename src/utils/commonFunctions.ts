/* eslint-disable indent */
import { DateTime } from 'luxon';
import { ReceivedUser } from 'src/models/apiModels';
import {
	Gender,
	Task, Urgency, User,
} from '../models/mainModels';

export function filterTasksByUrgency(tasks: Task[], urgency: Urgency): Task[] {
	return tasks.filter((task) => task.urgency === urgency);
}

// TYPE CHECK

export const isTask = (task: Task | undefined): task is Task => !!task;

// TYPE PARSE

export const parseUser = (receivedUser : ReceivedUser): User => {
	let parsedSex: Gender = Gender.NOT_INFORMED;

	switch (receivedUser.sex) {
		case 'male':
			parsedSex = Gender.MALE;
			break;
		case 'female':
			parsedSex = Gender.FEMALE;
			break;
		case 'non_binary':
			parsedSex = Gender.NON_BINARY;
			break;
		default:
	}

	const parsedBirthday = new Date(receivedUser.birthday);

	return {
		userId: receivedUser.user_id,
		username: receivedUser.username,
		fullName: receivedUser.full_name,
		email: receivedUser.email,
		sex: parsedSex,
		birthday: parsedBirthday,
	};
};

// DATE FORMATTERS

export const formatDateToIso = (date: Date): string => DateTime.fromJSDate(date).toISODate()
	|| date.toISOString().slice(0, 10);

export const formatDateToLocale = (
	date: Date | undefined,
	locale: string,
): string => {
	if (!date) return '';

	return DateTime.fromJSDate(date).setLocale(locale).toLocaleString();
};
