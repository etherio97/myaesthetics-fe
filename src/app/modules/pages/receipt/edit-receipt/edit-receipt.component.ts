import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_CONFIG, MY_DATE_FORMATS } from 'app/app.config';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ReceiptService } from 'app/services/receipt.service';
import { ItemService } from 'app/services/item.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { clone } from 'lodash';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import moment from 'moment';
import { ConfirmService } from 'app/services/confirm.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ListMemberComponent } from '../../member/list-member/list-member.component';

@Component({
    selector: 'app-edit-receipt',
    templateUrl: './edit-receipt.component.html',
    providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class EditReceiptComponent implements OnInit {
    formGroup!: FormGroup;

    items: any[] = [];

    selectedItems: any[] = [];

    paymentMethods = APP_CONFIG.PAYMENT_METHODS;

    itemFilteredOptions!: Observable<string[]>;

    itemTypes = APP_CONFIG.ITEM_TYPES;

    _modal!: MatDialogRef<ListMemberComponent, any>;

    member: any;

    receiptId!: string;

    constructor(
        private _receiptService: ReceiptService,
        private _itemService: ItemService,
        private _fb: FormBuilder,
        private _confirmService: ConfirmService,
        private _router: Router,
        private route: ActivatedRoute,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.formGroup = this._fb.group({
            customerName: ['', Validators.required],
            customerContact: [''],
            date: [''],
            member: [''],
            paymentMethod: ['Cash', Validators.required],
            discountAmount: [''],
            discountPercent: [''],
            item: [''],
            type: ['Saloon'],
        });

        this.route.params.subscribe((params) => {
            this.receiptId = params['id'];
            this._receiptService
                .findById(this.receiptId)
                .subscribe((res: any) => {
                    let discount = 0;
                    for (let item of res.items) {
                        if (item.discount) {
                            discount += item.discount;
                        }
                    }
                    res.discountAmount -= discount;
                    this.formGroup.patchValue(res);
                    if (res.member) {
                        this.member = res.member;
                    }
                    this.selectedItems = res.items || [];
                });
        });

        this.formGroup.controls.discountPercent.valueChanges.subscribe(
            (value) => {
                let subTotal = this.getSubTotal();
                let discountAmount = subTotal * (value / 100);
                this.formGroup.controls.discountAmount.setValue(discountAmount);
            },
        );

        this._itemService.getAll({}).subscribe((res: any) => {
            this.items = res;
        });

        this.itemFilteredOptions =
            this.formGroup.controls.item.valueChanges.pipe(
                startWith(''),
                map((value) => this._filterItem(value || '')),
            );
    }

    openMemberDialog() {
        this._modal = this.dialog.open(ListMemberComponent, {
            width: '80vw',
            height: '80vh',
        });
        this._modal.componentInstance.isModal = true;
        this._modal.componentInstance.onSelectedMember.subscribe(
            (member: any) => {
                this.member = member;
                this.formGroup.controls.member.setValue(member.id);
                this.formGroup.controls.customerName.setValue(member.fullName);
                this.formGroup.controls.customerContact.setValue(
                    member.phoneNumber,
                );
                this._modal.close();
            },
        );
    }

    displayItemFn(item: any): string {
        return item && item.name ? item.name : '';
    }

    private _filterItem(value: any): any[] {
        // Check if value is a string (from typing) or an object (from selection)
        const filterValue =
            typeof value === 'string' ? value.toLowerCase() : '';

        const itemList = this.items.filter(
            (item) => item.itemType === this.formGroup.value.type,
        );

        return itemList
            .filter(
                (option) =>
                    !this.selectedItems.some(
                        (selected) => selected.id == option.id,
                    ),
            )
            .filter((option) =>
                option.name.toLowerCase().includes(filterValue),
            );
    }

    onItemSelect(event: MatAutocompleteSelectedEvent): void {
        const selectedItem = event.option.value;

        if (!selectedItem) return;

        if (!!this.selectedItems.find(({ id }) => id === selectedItem.id)) {
            selectedItem.quantity++;
        } else {
            selectedItem.quantity = 1;

            this.selectedItems.push(selectedItem);
        }

        this.recalculateDiscount();

        setTimeout(() => {
            this.formGroup.get('item')?.setValue('');
        });
    }

    updateDiscountOnItem(item: any, amount: any) {
        if (amount.includes('%')) {
            const percent = parseFloat(amount.replace('%', ''));
            item.discount = (item.sellingPrice * item.quantity * percent) / 100;
        } else {
            item.discount = parseFloat(amount) || 0;
        }
        this.recalculateDiscount();
    }

    recalculateDiscount() {
        if (this.formGroup.controls.discountPercent.value) {
            let subTotal = this.getSubTotal();
            let discountAmount =
                subTotal *
                (this.formGroup.controls.discountPercent.value / 100);
            this.formGroup.controls.discountAmount.setValue(discountAmount);
        }
    }

    removeItem(index: number): void {
        this.selectedItems.splice(index, 1);
        this.recalculateDiscount();
    }

    submit() {
        if (!this.formGroup.valid) {
            return this._confirmService.error(
                'Please fill all the required fields.',
                'Invalid',
            );
        }
        if (!this.selectedItems.length) {
            return this._confirmService.error('Please input items.', 'Invalid');
        }
        this._confirmService
            .confirm('Are you sure to create this receipt?')
            .beforeClosed()
            .subscribe(
                (value) => value === 'confirmed' && this.confirmSubmit(),
            );
    }

    confirmSubmit() {
        const data = clone(this.formGroup.value);

        data.items = this.selectedItems;

        data.subtotal = this.getSubTotal();

        data.grandTotal = this.getGrandTotal();

        data.discountAmount = this.getDiscount();

        if (data.date) {
            data.date = moment(data.date).toISOString();
        } else {
            data.date = moment().toISOString();
        }

        if (!data.member) {
            delete data.member;
        }

        delete data.item;
        delete data.discountPercent;

        this._receiptService.update(this.receiptId, data).subscribe(() => {
            setTimeout(() => {
                this._router.navigate(['/receipts', 'view', this.receiptId]);
            });
        });
    }

    getSubTotal() {
        let i = 0;

        this.selectedItems.forEach((item) => {
            i += item.sellingPrice * item.quantity;
        });

        return i;
    }

    getGrandTotal() {
        return this.getSubTotal() - this.getDiscount();
    }

    getDiscount() {
        let i = 0;

        if (this.formGroup.controls.discountAmount.value) {
            i += this.formGroup.controls.discountAmount.value;
        }

        this.selectedItems.forEach((item) => {
            if (item.discount) {
                i += item.discount;
            }
        });

        return i;
    }
}
