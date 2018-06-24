import { EmployeeService } from './employee/employee.service';
import { UtilsService } from './parking/parking-create/utils-service';
import { ParkingComponent } from './parking/parking.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from './../shared/shared.module';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { LoadingScreenComponent } from './../loading-screen/loading-screen.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeComponent } from './employee/employee.component';
import { ServiceComponent } from './service/service.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ParkingDetailComponent } from './parking/parking-detail/parking-detail.component';
import { LoaderComponent } from './loader/loader.component';
import { ParkingListComponent } from './parking/parking-list/parking-list.component';
import { ParkingCreateComponent } from './parking/parking-create/parking-create.component';
import { ParkingService } from './parking/parking.service';

import { AgmCoreModule } from '@agm/core';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeCreateComponent } from './employee/employee-create/employee-create.component';
import { EmployeeDetailComponent } from './employee/employee-detail/employee-detail.component';
import { NgDropFilesDirective } from './ng-dropfiles.directive';

@NgModule({
  declarations: [
    AdminComponent,
    HeaderComponent,
    ParkingComponent,
    EmployeeComponent,
    ServiceComponent,
    PaginationComponent,
    ParkingDetailComponent,
    LoaderComponent,
    ParkingListComponent,
    NgDropFilesDirective,
    ParkingCreateComponent,
    EmployeeListComponent,
    EmployeeCreateComponent,
    EmployeeDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC4VUJLWpjtpsr1ASLz6b8LSS2eYgqBhiw'
    })
  ],
  providers: [
    ParkingService,
    EmployeeService,
    UtilsService
  ]
})
export class AdminModule {

}
