import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_CONFIG, MY_DATE_FORMATS } from 'app/app.config';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { clone } from 'lodash';
import { ConfirmService } from 'app/services/confirm.service';
import { MemberService } from 'app/services/member.service';

@Component({
    selector: 'app-edit-member',
    templateUrl: './edit-member.component.html',
    providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class EditMemberComponent implements OnInit {
    formGroup!: FormGroup;

    memberTypes = APP_CONFIG.MEMBER_TYPES;

    id!: string;

    constructor(
        private _memberService: MemberService,
        private _fb: FormBuilder,
        private _confirmService: ConfirmService,
        private _router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.formGroup = this._fb.group({
            fullName: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            memberType: ['', Validators.required],
            email: [''],
            address: [''],
        });

        this.route.params.subscribe(({ id }) => {
            this.id = id;
            this.loadData();
        });
    }

    loadData() {
        this._memberService.findById(this.id).subscribe((result: any) => {
            this.formGroup.controls.fullName.setValue(result.fullName);
            this.formGroup.controls.phoneNumber.setValue(result.phoneNumber);
            this.formGroup.controls.memberType.setValue(result.memberType);
            this.formGroup.controls.email.setValue(result.email);
            this.formGroup.controls.address.setValue(result.address);
        });
    }

    submit() {
        if (!this.formGroup.valid) {
            return this._confirmService.error(
                'Please fill all the required fields.',
                'Invalid',
            );
        }

        this._confirmService
            .confirm('Are you sure to edit this member?')
            .beforeClosed()
            .subscribe(
                (value) => value === 'confirmed' && this.confirmSubmit(),
            );
    }

    private confirmSubmit() {
        const data = clone(this.formGroup.value);
        this._memberService.update(this.id, data).subscribe(() => {
            this._router.navigate(['/members']);
        });
    }
}
