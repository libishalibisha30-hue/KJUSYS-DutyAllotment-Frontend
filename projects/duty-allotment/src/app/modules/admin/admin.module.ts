import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminModuleRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';


@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    AdminModuleRoutingModule
  ]
})
export class AdminModule { }
