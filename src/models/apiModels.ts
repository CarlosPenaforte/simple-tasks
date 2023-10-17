// MODELS TO SEND
export type CreateUserToSend = {
    username: string;
    user_password: string;
    full_name: string;
    email: string;
    sex: string;
    birthday: string;
    confirm_password: string;
}

export type UpdateUserToSend = {
    username: string;
    full_name: string;
    email: string;
    sex: string;
    birthday: string;
}

// MODELS TO RECEIVE

export type ReceivedUser = {
    readonly user_id: number;
    username: string;
    full_name: string;
    email: string;
    sex: string;
    birthday: string;
}

// AUTH

export type LoginResponse = {
    readonly auth: boolean;
    readonly token?: string;
    user?: ReceivedUser;
    message?: string;
}

export type LogoutResponse = {
    readonly hasError : boolean;
    message: string;
}

export type RegisterResponse = {
    readonly hasError: boolean;
    answer: string;
}

export type UpdateUserResponse = {
    readonly hasError: boolean;
    user?: ReceivedUser;
    answer?: string;
}

export type GetUserResponse = {
    readonly hasError: boolean;
    user?: ReceivedUser;
    message?: string;
}
