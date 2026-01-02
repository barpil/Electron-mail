import {inject, Injectable} from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
    private readonly router = inject(Router);


  logout(){
      console.log("User logout");
      this.router.navigate(['/login'])
  }
}
