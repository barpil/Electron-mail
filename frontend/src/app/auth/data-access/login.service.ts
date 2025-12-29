import {Injectable} from '@angular/core';
import {LoginFormModel} from "../feature/login-page/login-form/login-form";
import {delay, of, switchMap, throwError} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class LoginService {
    //tymczasowy dummy service

  login(loginFormModel: LoginFormModel){
      //dummy login
      let result = false;
      if(loginFormModel.email === "admin@electron.pl" && loginFormModel.password === "password"){
          result = true;
      }
      return of(result).pipe(
          delay(2000),
          switchMap(result => {
              if(!result){
                  return throwError(() => new InvalidCredentialsError())
              }
              return of(undefined);
          })
      )
      //Bedzie też będzie pamiętać żeby rozważyć przypadek, w którym odpowiedz z serwera jest nieprzewidziana
      //np. inna niz domyslnie dla odrzuconych credentiali i tez to rozwiazac.
  }
}

export interface LoginRequest{
    email: string;
    //Potem trzeba bedzie zrobic zeby szyfrowac to haslo przed przeslaniem
    password: string;
}

export interface LoginResponse{
    token: string;
    user: {id: string, email: string}
}

export class InvalidCredentialsError extends Error{
    constructor() {
        super("Passed credentails were incorrect");
    }
}

