import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { UsuarioService } from 'src/app/auth/usuario.service';

@Component({
  selector: 'app-cliente-lista',
  templateUrl: './cliente-lista.component.html',
  styleUrls: ['./cliente-lista.component.css']
})
export class ClienteListaComponent implements OnInit, OnDestroy {

  clientes: Cliente[] = [];
  private clientesSubscription: Subscription;
  public estaCarregando = false;
  totalDeClientes: number = 0;
  totalDeClientesPorPagina: number = 2;
  opcoesTotalDeClientesPorPagina = [2, 5, 10];
  public autenticado: boolean = false;
  private authObserver: Subscription;

  constructor(private clienteService: ClienteService, private usuarioService: UsuarioService) {}

  paginaAtual: number= 1; //definir

  ngOnInit(): void {
    this.estaCarregando = true;
    this.clienteService.getClientes(this.totalDeClientesPorPagina, this.paginaAtual);
    this.clientesSubscription= this.clienteService.getListaDeClientesAtualizadaObservable()
    .subscribe((dados: { clientes: [], maxClientes: number}) => {
      this.estaCarregando = false;
      this.clientes= dados.clientes;
      this.totalDeClientes = dados.maxClientes
    });
    this.autenticado = this.usuarioService.isAutenticado();
    this.authObserver = this.usuarioService.getStatusSubject().subscribe((autenticado) => this.autenticado = autenticado)
  }

  ngOnDestroy(): void {
    this.clientesSubscription.unsubscribe();
    this.authObserver.unsubscribe();
  }

  onDelete ( id: string): void {
    this.estaCarregando = true;
    this.clienteService.removerCliente(id).subscribe(() => {
      this.clienteService.getClientes( this.totalDeClientesPorPagina, this.paginaAtual);
    });
  }

  onPaginaAlterada (dadosPagina: PageEvent) {
    //console.log (dadosPagina);
    this.estaCarregando = true;
    this.paginaAtual = dadosPagina.pageIndex + 1;//no paginator a contagem come??a de 0
    this.totalDeClientesPorPagina = dadosPagina.pageSize;
    this.clienteService.getClientes (this.totalDeClientesPorPagina, this.paginaAtual);

  }

}
