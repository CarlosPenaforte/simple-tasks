import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import {
	CreateProjectResponse,
	CreateProjectToSend,
	DeleteProjectResponse,
	GetAllProjectsResponse,
	GetProjectResponse,
	UpdateProjectResponse,
} from 'src/models/apiModels';

export const create = (
	userId: number,
	projectToSend: CreateProjectToSend,
): Promise<AxiosResponse<CreateProjectResponse>> => {
	const path = `/api/v1/users/${userId}/projects`;

	return api.post(path, { project: projectToSend });
};

export const update = (
	userId: number,
	projectId: number,
	projectToSend: CreateProjectToSend,
): Promise<AxiosResponse<UpdateProjectResponse>> => {
	const path = `/api/v1/users/${userId}/projects/${projectId}`;

	return api.put(path, { project: projectToSend });
};

export const getAll = (userId: number): Promise<AxiosResponse<GetAllProjectsResponse>> => {
	const path = `/api/v1/users/${userId}/projects`;

	return api.get(path);
};

export const getById = (userId: number, projectId: number): Promise<AxiosResponse<GetProjectResponse>> => {
	const path = `/api/v1/users/${userId}/projects/${projectId}`;

	return api.get(path);
};

export const deleteById = (userId: number, projectId: number): Promise<AxiosResponse<DeleteProjectResponse>> => {
	const path = `/api/v1/users/${userId}/projects/${projectId}`;

	return api.delete(path);
};
