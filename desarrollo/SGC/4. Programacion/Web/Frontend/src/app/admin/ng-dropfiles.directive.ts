import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileItem } from './parking/parking-create/file-item';
import { UtilsService } from './parking/parking-create/utils-service';

@Directive({
  selector: '[NgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = [];
  @Output() archivosSobre: EventEmitter<any> = new EventEmitter();
  @Output() archivosImg: EventEmitter<any> = new EventEmitter();

  constructor(public elemento: ElementRef, private _utilsService: UtilsService) {
    // console.log("onchange event");
  }

  @HostListener('dragenter', ['$event'])
  public onDragEnter(event: any) {
    // console.log("onchange event1");
    this.archivosSobre.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    // console.log("onchange event2");
    this.archivosSobre.emit(false);
  }

  @HostListener('dragover', ['$event'])
  public onDragOver(event: any) {
    // console.log("onchange event3");
    let transferencia = this._getTransferencia(event);
    transferencia.dropEffect = 'copy';

    this._prevenirYdetener(event);

    this.archivosSobre.emit(true);
  }

  /* Este evento es del momento que se suelta el/los archivo(s) en la caja */
  @HostListener('drop', ['$event'])
  public onDrop(event: any) {
    // console.log("onchange event4");
    let transferencia = this._getTransferencia(event);
    if (!transferencia) {
      return;
    }
    this._agregarArchivos(transferencia.files);
    this.archivosSobre.emit(false);
    this._prevenirYdetener(event);

  }
  @HostListener('change', ['$event'])
  public onchange(event: any) {
    // console.log("onchange event5");
    if (!event.target.files) {
      return;
    }
    // this.archivos = [];
    //  console.log(this.archivos);
    this._agregarArchivos(event.target.files);
    this.archivosSobre.emit(false);
    this._prevenirYdetener(event);
    // console.log('this.archivos antes de emitir: ', this.archivos);
    // console.log('tamaño: ', this.archivos.length);

    // console.log(this.archivos);
  }
  private mandarImg() {

  }

  private _getTransferencia(event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _agregarArchivos(archivosLista: FileList) {

    for (let propiedad in Object.getOwnPropertyNames(archivosLista)) {
      let archTemporal = archivosLista[propiedad];
      if (this._archivoPuedeSerCargado(archTemporal)) {

        /******************************************** */
        this._utilsService._getFile64(archTemporal).then(res => {
          let nuevoArchivo = new FileItem(archTemporal, res);
          this.archivos.push(nuevoArchivo);
          // this.archivos[0]=nuevoArchivo;
          this.archivosImg.emit(this.archivos);
        }).catch(error => {
          // console.log(error);
        });

        /******************************************** */
      }
      break;
    }
    // console.log(this.archivos);

  }

  private _prevenirYdetener(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoPuedeSerCargado(archivo: File) {
    if (!this._archivoYaFueDroppeado(archivo.name) && this._esImagen(archivo.type) && this.archivos.length < 1 && archivo.size < 102400) {
      return true;
    }
    return false;
  }

  private _archivoYaFueDroppeado(nombreArchivo: string): boolean {
    for (let i in this.archivos) {
      let arch = this.archivos[i];
      if (arch.archivo.name === nombreArchivo) {
        // console.log("Archivo ya existe en la lista", nombreArchivo);
        return true;
      }
    }
    return false;
  }

  private _esImagen(tipoArchivo: string): boolean {
    return (tipoArchivo == '' || tipoArchivo == undefined) ? false : tipoArchivo.startsWith("image");
  }
}
