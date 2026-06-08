import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacultyRoutingModule } from './faculty-routing.module';
import { FacultyComponent } from './faculty.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssignedDutiesComponent } from './assigned-duties/assigned-duties.component';
import { SwapDutiesComponent } from './swap-duties/swap-duties.component';
import { DutyHistoryComponent } from './duty-history/duty-history.component';
import { TabsModule } from '@libs/tabs'; // ← import the tabs lib

@NgModule({
  declarations: [
    FacultyComponent,
    DashboardComponent,
    AssignedDutiesComponent,
    SwapDutiesComponent,
    DutyHistoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FacultyRoutingModule,
    TabsModule  // ← add here
  ]
})
export class FacultyModule {}