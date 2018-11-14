import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  cargando = true;
  productos: Producto[] = [];
  productosFiltro: Producto[] = [];

  constructor( private http: HttpClient ) {
      this.cargarProductos();
  }

  private cargarProductos() {
    return new Promise( (resolve, reject) => {
      this.http.get('https://angular-html-f5ffd.firebaseio.com/productos_idx.json')
        .subscribe( (resp: Producto[]) => {
            this.productos = resp;
            this.cargando = false;
            resolve();
        });
    });
  }

  getProducto( id: string ) {
    return this.http.get(`https://angular-html-f5ffd.firebaseio.com/productos/${ id }.json`);
  }

  buscarProducto ( termino: string ) {
    if (this.productos.length === 0) {
      this.cargarProductos().then( () => {
        this.filtrarProductos( termino );
      });
    } else {
      this.filtrarProductos( termino );
    }
  }

  private filtrarProductos( termino: string ) {
    this.productosFiltro = [];

    termino = termino.toLowerCase();

    this.productos.forEach( prod => {
      const catLowerCase = prod.categoria.toLowerCase();
      const titLowerCase = prod.titulo.toLowerCase();

      if ( catLowerCase.indexOf( termino ) >= 0 || titLowerCase.indexOf( termino ) >= 0 ) {
        this.productosFiltro.push( prod );
      }
    });
  }
}
