import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor(){}

  _getFile64(file:File){
    return new Promise(function (resolve, reject) {
        let reader: FileReader = new FileReader();
        reader.onloadend = function(fileLoadedEvent:any) {
          resolve(fileLoadedEvent.target.result);
        }
        reader.readAsDataURL(file);
     });
  }
}