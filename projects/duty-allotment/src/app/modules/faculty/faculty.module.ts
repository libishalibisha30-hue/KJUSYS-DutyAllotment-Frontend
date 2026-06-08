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
import { SubTabsModule } from '@libs/sub-tabs'; // ← import the sub-tabs lib
import { DropdownLibModule } from '@libs/dropdown-lib'; // ← import the dropdown lib

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
    TabsModule,        // ← main tabs
    SubTabsModule,     // ← sub-tabs
    DropdownLibModule  // ← dropdown lib
  ]
})
export class FacultyModule {}