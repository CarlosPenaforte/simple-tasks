import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import {
	RegisterResponse, CreateUserToSend, UpdateUserToSend, UpdateUserResponse,
} from 'src/models/apiModels';

export const register = (userToSend : CreateUserToSend): Promise<AxiosResponse<RegisterResponse>> => api.post('/api/v1/users', { user: userToSend });

export const update = (userId: number, userToSend : UpdateUserToSend): Promise<AxiosResponse<UpdateUserResponse>> => {
	const path = `/api/v1/users/${userId}`;

	return api.put(path, { user: userToSend });
};
