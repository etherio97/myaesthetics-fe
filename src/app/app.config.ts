import { FuseNavigationItem } from '../@fuse/components/navigation';

export const BASE_URL = ['localhost', '127.0.0.1'].includes(location.hostname)
    ? `http://${location.hostname}:3000`
    : `${location.protocol}//${location.hostname}/api`;

export const SERVICE_URLS = {
    ITEM_API: `${BASE_URL}/item`,
    RECEIPT_API: `${BASE_URL}/receipt`,
    MEMBER_API: `${BASE_URL}/member`,
    AUTH_API: `${BASE_URL}/auth`,
    DASHBOARD_API: `${BASE_URL}/dashboard`,
    EXPENSE_API: `${BASE_URL}/expense`,
};

export const APP_CONFIG = {
    ADMIN_ROLES: ['admin', 'manager', 'cashier'],
    MANAGER_ROLES: ['cashier'],
    GENDERS: ['Male', 'Female'],
    ITEM_TYPES: ['Saloon', 'Facial'],
    PAYMENT_METHODS: ['Cash', 'MMQR', 'Credit', 'Other'],
    MEMBER_TYPES: ['Regular', 'VIP', 'VVIP'],
    EXPENSE_CATEGORY: [
        'Miscellaneous',
        'Stationery',
        'Transportation',
        'Utilities',
        'Maintenance',
        'Other',
    ],
};

export const NAVIGATION_ITEMS: FuseNavigationItem[] = [
    {
        type: 'group',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                type: 'basic',
                icon: 'mat_solid:dashboard',
                link: '/dashboard',
                meta: {
                    roles: ['admin', 'manager', 'cashier'],
                },
            },
            {
                id: 'members',
                title: 'Members',
                type: 'basic',
                icon: 'mat_solid:people',
                link: '/members',
                meta: {
                    roles: ['admin', 'manager', 'cashier'],
                },
            },
            {
                id: 'receipts',
                title: 'Receipts',
                type: 'basic',
                icon: 'mat_solid:receipt_long',
                link: '/receipts',
                meta: {
                    roles: ['admin', 'manager', 'cashier'],
                },
            },
            {
                id: 'deleted-receipts',
                title: 'Deleted Receipts',
                type: 'basic',
                icon: 'mat_solid:restore',
                link: '/deleted-receipts',
                meta: {
                    roles: ['admin', 'manager'],
                },
            },
            {
                id: 'expense',
                title: 'Expense',
                type: 'basic',
                icon: 'mat_solid:history_edu',
                link: '/expense',
                meta: {
                    roles: ['admin', 'manager', 'cashier'],
                },
            },
            {
                id: 'items',
                title: 'Items',
                type: 'basic',
                icon: 'mat_solid:inventory_2',
                link: '/items',
                meta: {
                    roles: ['admin', 'manager', 'cashier'],
                },
            },

            // Admin
            {
                id: 'users',
                title: 'Users',
                type: 'basic',
                icon: 'mat_solid:admin_panel_settings',
                link: '/users',
                meta: {
                    roles: ['admin', 'manager'],
                },
            },
        ],
    },
];

export const MY_DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY', // How the input is parsed from manual typing
    },
    display: {
        dateInput: 'DD/MM/YYYY', // How the date is displayed in the input field
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
