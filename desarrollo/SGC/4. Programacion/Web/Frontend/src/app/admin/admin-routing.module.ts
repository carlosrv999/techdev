import { ServiceCreateComponent } from './service/service-create/service-create.component';
import { ServiceListComponent } from './service/service-list/service-list.component';
import { EmployeeCreateComponent } from './employee/employee-create/employee-create.component';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { ServiceComponent } from './service/service.component';
import { EmployeeComponent } from './employee/employee.component';
import { ParkingComponent } from './parking/parking.component';
import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParkingListComponent } from './parking/parking-list/parking-list.component';
import { ParkingCreateComponent } from './parking/parking-create/parking-create.component';

const adminRoutes: Routes = [
  { path: '', component: AdminComponent, children: [
    { path: '', redirectTo: '/home/parkings', pathMatch: 'full' },
    { path: 'parkings', component: ParkingComponent, children: [
      { path: '', component: ParkingListComponent },
      { path: 'create', component: ParkingCreateComponent }
    ] },
    { path: 'employees', component: EmployeeComponent, children: [
      { path: '', component: EmployeeListComponent },
      { path: 'create', component: EmployeeCreateComponent }
    ] },
    { path: 'services', component: ServiceComponent, children: [
      { path: '', component: ServiceListComponent },
      { path: 'create', component: ServiceCreateComponent }
    ] }
  ] }
]

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule {

}
