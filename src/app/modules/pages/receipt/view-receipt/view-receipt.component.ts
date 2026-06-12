import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MY_DATE_FORMATS } from 'app/app.config';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ReceiptService } from 'app/services/receipt.service';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'app-view-receipt',
    templateUrl: './view-receipt.component.html',
    providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class ViewReceiptComponent implements OnInit {
    id!: string;

    data!: any;

    role!: any;

    constructor(
        private _receiptService: ReceiptService,
        private route: ActivatedRoute,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.userService.get().subscribe((profile) => {
            this.role = profile.role;
        });

        this.route.params.subscribe(({ id }) => {
            this.id = id;
            this.loadData();
        });
    }

    loadData() {
        this._receiptService.findById(this.id).subscribe((result) => {
            this.data = result;
        });
    }

    handlePrint() {
        window.print();
    }
}
