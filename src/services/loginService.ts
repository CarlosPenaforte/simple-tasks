import { api } from "@/boot/axios";
import { LoginResponse, LogoutResponse } from "@/models/apiModels";
import { AxiosResponse } from "axios";

export default {
  login: (email: string, password: string): Promise<AxiosResponse<LoginResponse>> => {
    return api.post("/auth/login", { email, password });
  },

  logout: (userId : number): Promise<AxiosResponse<LogoutResponse>> => {
    return api.post("/auth/logout", {user_id : userId});
  }
};