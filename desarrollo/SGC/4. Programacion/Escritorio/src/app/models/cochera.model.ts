import { Empleado } from './empleado.model';
import { ServicioCochera } from "app/models/servicio.model";
export class Cochera {
  public address: string;
  public capacity: number;
  public current_used: number;
  public coordenadas: {
    lat: number,
    lng: number
  }
  public description: string;
  public email: number;
  public id: boolean;
  public id_company: number;
  public cupos_disp: number;
  public username: string;
  public empleado: Empleado;
  public servicioCocheras: ServicioCochera[];
}