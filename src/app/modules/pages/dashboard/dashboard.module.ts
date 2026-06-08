import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.routing';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { DisplayItemComponent } from './components/display-item/display-item.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    declarations: [
        DashboardComponent,
        AdminDashboardComponent,
        ManagerDashboardComponent,
        DisplayItemComponent,
    ],
    imports: [
        RouterModule.forChild(dashboardRoutes),
        SharedModule,
        MatIconModule,
        MatButtonModule,
        NgApexchartsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatTabsModule,
    ],
})
export class DashboardModule {}
