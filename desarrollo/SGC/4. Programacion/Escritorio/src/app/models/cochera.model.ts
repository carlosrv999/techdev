import { Empleado } from './empleado.model';
import { ServicioCochera } from "app/models/servicio.model";
export class Cochera {
  public id_empresa: string;
  public id_empleado: string;
  public nombre: string;
  public coordenadas: {
    lat: number,
    lng: number
  }
  public direccion: string;
  public telefono: number;
  public estado: boolean;
  public capacidad: number;
  public cupos_disp: number;
  public username: string;
  public email: string;
  public id: string;
  public empleado: Empleado;
  public servicioCocheras: ServicioCochera[];
}