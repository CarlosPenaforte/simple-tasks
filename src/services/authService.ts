import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import {
	LoginResponse, LogoutResponse,
} from 'src/models/apiModels';

export const login = (email: string, password: string): Promise<AxiosResponse<LoginResponse>> => api.post('/auth/login', {
	email, password,
});

export const logout = (userId : number): Promise<AxiosResponse<LogoutResponse>> => api.post('/auth/logout', { user_id: userId });
