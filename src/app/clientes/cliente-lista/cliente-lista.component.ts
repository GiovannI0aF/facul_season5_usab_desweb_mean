import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-cliente-lista',
  templateUrl: './cliente-lista.component.html',
  styleUrls: ['./cliente-lista.component.css']
})
export class ClienteListaComponent implements OnInit, OnDestroy {

  clientes: Cliente[] = [];
  private clientesSubscription: Subscription;
  public estaCarregando = false;
  totalDeClientes: number = 10;
  totalDeClientesPorPagina: number = 2;
  opcoesTotalDeClientesPorPagina = [2, 5, 10];

  constructor(public clienteService: ClienteService) {}

  ngOnInit(): void {
    this.clienteService.getClientes();
    this.clientesSubscription= this.clienteService.getListaDeClientesAtualizadaObservable()
    .subscribe((clientes: Cliente[]) => {
      this.estaCarregando = false;
      this.clientes= clientes;
    });
  }

  ngOnDestroy(): void {
    this.clientesSubscription.unsubscribe();
  }

  onDelete ( id: string): void {
    this.clienteService.removerCliente(id);
  }

}
