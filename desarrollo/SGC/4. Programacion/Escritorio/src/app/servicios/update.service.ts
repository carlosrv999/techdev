import { Observable } from 'rxjs/Observable';
import { Subject } from "rxjs/Subject";
export class UpdateService {
  public clicked: Observable<boolean>;

  private boolSubject: Subject<boolean>;

  constructor() {
    this.boolSubject = new Subject<boolean>();
    this.clicked = this.boolSubject.asObservable();
  }

  onClick() {
    this.boolSubject.next(true);
  }
} 