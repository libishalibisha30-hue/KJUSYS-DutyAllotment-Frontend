import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacultyComponent } from './faculty.component';

const routes: Routes = [
  {
    path: '',
    component: FacultyComponent  // shell handles tab switching internally
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacultyRoutingModule {}