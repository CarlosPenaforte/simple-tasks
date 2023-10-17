import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import {
	CreateTaskResponse,
	CreateTaskToSend,
	DeleteTaskResponse,
	GetAllTasksResponse,
	GetTaskResponse,
	UpdateTaskResponse,
} from 'src/models/apiModels';

export const create = (userId: number, taskToSend: CreateTaskToSend): Promise<AxiosResponse<CreateTaskResponse>> => {
	const path = `/api/v1/users/${userId}/tasks`;

	return api.post(path, { task: taskToSend });
};

export const update = (
	userId: number,
	taskId: number,
	taskToSend: CreateTaskToSend,
): Promise<AxiosResponse<UpdateTaskResponse>> => {
	const path = `/api/v1/users/${userId}/tasks/${taskId}`;

	return api.put(path, { task: taskToSend });
};

export const getAll = (userId: number): Promise<AxiosResponse<GetAllTasksResponse>> => {
	const path = `/api/v1/users/${userId}/tasks`;

	return api.get(path);
};

export const getById = (userId: number, taskId: number): Promise<AxiosResponse<GetTaskResponse>> => {
	const path = `/api/v1/users/${userId}/tasks/${taskId}`;

	return api.get(path);
};

export const deleteById = (userId: number, taskId: number): Promise<AxiosResponse<DeleteTaskResponse>> => {
	const path = `/api/v1/users/${userId}/tasks/${taskId}`;

	return api.delete(path);
};
