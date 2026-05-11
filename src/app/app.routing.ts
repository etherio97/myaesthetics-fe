import { Route } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { NoAuthGuard } from './core/auth/guards/noAuth.guard';
import { AuthGuard } from './core/auth/guards/auth.guard';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('app/modules/pages/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule,
                    ),
            },
            {
                path: 'users',
                loadChildren: () =>
                    import('app/modules/pages/user/user.module').then(
                        (m) => m.UserModule,
                    ),
            },
            {
                path: 'members',
                loadChildren: () =>
                    import('app/modules/pages/member/member.module').then(
                        (m) => m.MemberModule,
                    ),
            },
            {
                path: 'items',
                loadChildren: () =>
                    import('app/modules/pages/item/item.module').then(
                        (m) => m.ItemModule,
                    ),
            },
            {
                path: 'receipts',
                loadChildren: () =>
                    import('app/modules/pages/receipt/receipt.module').then(
                        (m) => m.ReceiptModule,
                    ),
            },
            {
                path: 'deleted-receipts',
                loadChildren: () =>
                    import('app/modules/pages/deleted-receipt/deleted-receipt.module').then(
                        (m) => m.DeletedReceiptModule,
                    ),
            },
        ],
    },

    {
        path: 'login',
        canActivate: [NoAuthGuard],
        loadChildren: () =>
            import('app/modules/auth/auth.module').then((m) => m.AuthModule),
    },
];
