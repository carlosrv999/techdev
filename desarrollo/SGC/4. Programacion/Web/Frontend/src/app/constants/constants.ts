import { Location } from '@angular/common';
// Get the hostname
this.hostname = location.host;
if (this.hostname.indexOf(':') > 0) {
  this.hostname = this.hostname.substr(0, this.hostname.indexOf(':'));
}
// Add a port or a subdomain to get the API url:

this.apiUrl = 'http://' + this.hostname + ':8080';
const urlBase = this.hostname;

export class AppUtil {
  public static HTTP: string = 'http://';
  public static HTTPS: string = 'http://';
  public static IP: string = urlBase + ':3000';
  /*public static IP: string = 'localhost';*/
  public static PORT: string = '3000';
  public static TIPO_SERVICIO_API: string = 'api/tipoServicios';
  public static COCHERA_API: string = 'api/cocheras';
  public static EMPLEADO_API: string = 'api/empleados';
  public static LIMA_GEOPOINT: {
    lat: -12.060897,
    lng: -77.042889
  };
}
