import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';



const routes:Routes = [
    {
        path:'',
        component:AdminComponent,
        data:{
            breadcrumb:{
                module:'KJUSYS',
                subModule: 'admin',
                url: 'duty-allotment/admin'
            },
            submenu:true,
        }
    }
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminModuleRoutingModule {}
