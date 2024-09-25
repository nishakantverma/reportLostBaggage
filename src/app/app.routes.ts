import { Routes } from '@angular/router';
import { ReportFormComponent } from './report-form/report-form.component';

export const routes: Routes = [
    {path:'',redirectTo:'report',pathMatch:'full'},
    {path:'report',component:ReportFormComponent},
];
