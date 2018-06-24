import { Constantes } from './../models/constantes';
import { Injectable } from "@angular/core";
import { Http } from "@angular/http"

@Injectable()
export class CocheraService {
  constructor(private http: Http) {}
  
  public getCochera(id: string) {
    return this.http.get(Constantes.HTTP+Constantes.IP+':'+Constantes.PORT+'/'+Constantes.COCHERA_API+'/'+id+"?filter[include]=empleado&filter[include][servicioCocheras]=tipoServicio");
  }

  public patchCocheraEstado(id: string, estado: boolean) {
    return this.http.patch(Constantes.HTTP+Constantes.IP+':'+Constantes.PORT+'/'+Constantes.COCHERA_API+'/'+id, {
      "estado": estado
    });
  }

  public patchCocheraCupo(id: string, nuevo: number) {
    return this.http.patch(Constantes.HTTP+Constantes.IP+':'+Constantes.PORT+'/'+Constantes.COCHERA_API+'/'+id, {
      "cupos_disp": nuevo
    });
  }
}