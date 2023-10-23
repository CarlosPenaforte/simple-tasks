import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import {
	RegisterResponse, CreateUserToSend, UpdateUserToSend, UpdateUserResponse, GetUserResponse,
} from 'src/models/apiModels';
import { DeleteUserResponse } from '../models/apiModels';

export const register = (userToSend : CreateUserToSend): Promise<AxiosResponse<RegisterResponse>> => api.post('/api/v1/users', { user: userToSend });

export const update = (userId: number, userToSend : UpdateUserToSend): Promise<AxiosResponse<UpdateUserResponse>> => {
	const path = `/api/v1/users/${userId}`;

	return api.put(path, { user: userToSend });
};

export const getById = (userId: number): Promise<AxiosResponse<GetUserResponse>> => {
	const path = `/api/v1/users/${userId}`;

	return api.get(path);
};

export const deleteById = (userId: number): Promise<AxiosResponse<DeleteUserResponse>> => {
	const path = `/api/v1/users/${userId}`;

	return api.delete(path);
};
