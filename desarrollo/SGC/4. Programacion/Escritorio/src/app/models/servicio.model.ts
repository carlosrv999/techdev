import { TipoServicio } from "app/models/tipo-servicio.model";

export class ServicioCochera {
  public id_cochera: string;
  public id_servicio: string;
  public precio_hora: number;
  public estado: boolean;
  public id: string;
  public tipoServicio: TipoServicio;
}