import { IUserData } from "./iuser-data";

export interface IAuthData {
    accessToken: string;
    //user: IUserData;
    username: string,
    tokenType: string
}
