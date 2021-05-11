import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private token: string;
  private autenticado: boolean =false;

  private authStatusSubject = new Subject <boolean>();

  public getToken (): string {
    return this.token;
  }

  public getStatusSubject() {
    return this.authStatusSubject.asObservable();
  }

  constructor( private httpClient: HttpClient, private router: Router) {

  }

  public isAutenticado() : boolean {
    return this.autenticado;
  }

  criarUsuario (email: string, senha: string) {
    const authData: AuthData = {
      email: email,
      password: senha
    }
    this.httpClient.post( "http://localhost:3000/api/usuario/signup", authData).subscribe(resposta => {
      console.log (resposta)
    });
  }

  login (email: string, senha: string) {
    const authData: AuthData = {
      email: email,
      password: senha
    }
    this.httpClient.post<{ token: string }>("http://localhost:3000/api/usuario/login", authData).subscribe( resposta => {
      this.token = resposta.token;
      if (this.token) {
        this.autenticado = true;
        this.authStatusSubject.next (true);
        /*renderiza o componente associado à raiz da aplicação. Ou seja, a lista de clientes. Lembre-se que especificamos um vetor para eventualmente montar uma URL em função de diversas variàveis */
        this.router.navigate (['/']);
      }
    });
  }

  logout() {
    this.token = null;
    this.authStatusSubject.next(false);
    this.router.navigate (['/']);
  }

}
