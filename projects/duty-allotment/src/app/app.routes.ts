import { Routes } from '@angular/router';
import { SharedAuthComponent } from '@libs/shared-auth';
import { NavigationComponent } from './modules/navigation/navigation.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: SharedAuthComponent,
    data: {
      module: 'duty-allotment',
    },
  },
  {
    path: 'kjusys',
    component: NavigationComponent,
    children: [
      {
        path: 'faculty',
        loadChildren: () =>
          import('./modules/faculty/faculty.module')
            .then((m) => m.FacultyModule)
            .catch((error) => {
               console.error('Error loading FacultyModule', error);
               throw error;
            }),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./modules/admin/admin.module')
            .then((m) => m.AdminModule)
            .catch((error) => {
               console.error('Error loading AdminModule', error);
               throw error;
            }),
      },


    ],
  },
];
