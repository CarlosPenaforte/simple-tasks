import { User } from './mainModels';

// LOGIN

export type LoginResponse = {
    readonly auth: boolean;
    readonly token?: string;
    user?: User;
    message?: string;
}

export type LogoutResponse = {
    readonly error : boolean;
    message: string;
}
