import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminModuleRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FacultyManagementComponent } from './faculty-management/faculty-management.component';
import { DutyManagementComponent } from './duty-management/duty-management.component';
import { DutyRecordsComponent } from './duty-records/duty-records.component';

import { TabsModule } from '@libs/tabs';
import { SubTabsModule } from '@libs/sub-tabs';
import { DropdownLibModule } from '@libs/dropdown-lib';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    FacultyManagementComponent,
    DutyManagementComponent,
    DutyRecordsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminModuleRoutingModule,
    TabsModule,
    SubTabsModule,
    DropdownLibModule
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule { }
