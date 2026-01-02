import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {

    getUserInfo(): UserInfo{
        return {username: "John Doe"};
    }

}

export interface UserInfo{
    username: string;
}
