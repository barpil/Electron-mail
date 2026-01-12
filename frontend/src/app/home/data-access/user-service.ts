import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, shareReplay} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class UserService {

    private readonly http = inject(HttpClient);

    getUserInfo(){
        return this.http.get<GetUserInfoResponse>("/api/user", {withCredentials: true}).pipe(
            map(response => {
                return {username: response.username, email: response.email}
            }),
            shareReplay(1)
        )
    }

}

export interface GetUserInfoResponse{
    username: string;
    email: string;
}

export interface UserInfo{
    username: string;
}
