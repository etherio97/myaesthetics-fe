import { Route } from '@angular/router';
import { ListMemberComponent } from './list-member/list-member.component';
import { CreateMemberComponent } from './create-member/create-member.component';
import { EditMemberComponent } from './edit-member/edit-member.component';

export const memberRoutes: Route[] = [
    {
        path: '',
        component: ListMemberComponent,
    },
    {
        path: 'create',
        component: CreateMemberComponent,
    },
    {
        path: 'edit/:id',
        component: EditMemberComponent,
    },
];
