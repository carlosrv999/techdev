export class FileItem{
  public archivo:File;
  public base64file: any;
  public nombreArchivo:string;
  public url:string;
  public estaSubiendo:boolean = false;
  public progreso:number = 0;

  constructor( archivo:File , b64:any){
      this.archivo = archivo;
      this.nombreArchivo = archivo.name;
      this.base64file = b64;
  }
}