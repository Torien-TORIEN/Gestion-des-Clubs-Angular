import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../Views/user-profile/user-profile.component';
import { TableListComponent } from '../../Views/clubs/table-list.component';
import { TypographyComponent } from '../../Views/evenements/typography.component';
import { IconsComponent } from '../../Views/salles/icons.component';
import { MapsComponent } from '../../Views/matriels/maps.component';
import { NotificationsComponent } from '../../Views/notifications/notifications.component';
import { UpgradeComponent } from '../../Views/login/upgrade.component';
import { AuthGuardService } from 'app/Services/auth.guard.service';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    { path: 'actualites',      component: DashboardComponent,canActivate:[AuthGuardService] },
    { path: 'membres',   component: UserProfileComponent,canActivate:[AuthGuardService] },
    { path: 'clubs',     component: TableListComponent,canActivate:[AuthGuardService] },
    { path: 'events',     component: TypographyComponent,canActivate:[AuthGuardService] },
    { path: 'salles',          component: IconsComponent,canActivate:[AuthGuardService] },
    { path: 'materiels',           component: MapsComponent,canActivate:[AuthGuardService] },
    { path: 'notifications',  component: NotificationsComponent,canActivate:[AuthGuardService] },
    //{ path: 'login',        component: UpgradeComponent },
];
