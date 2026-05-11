import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_CONFIG, MY_DATE_FORMATS } from 'app/app.config';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { clone } from 'lodash';
import { ConfirmService } from 'app/services/confirm.service';
import { MemberService } from 'app/services/member.service';

@Component({
    selector: 'app-create-member',
    templateUrl: './create-member.component.html',
    providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class CreateMemberComponent implements OnInit {
    formGroup!: FormGroup;

    memberTypes = APP_CONFIG.MEMBER_TYPES;

    constructor(
        private _memberService: MemberService,
        private _fb: FormBuilder,
        private _confirmService: ConfirmService,
        private _router: Router,
    ) {}

    ngOnInit(): void {
        this.formGroup = this._fb.group({
            fullName: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            memberType: ['', Validators.required],
            email: [''],
            address: [''],
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
            .confirm('Are you sure to create this item?')
            .beforeClosed()
            .subscribe(
                (value) => value === 'confirmed' && this.confirmSubmit(),
            );
    }

    private confirmSubmit() {
        const data = clone(this.formGroup.value);
        this._memberService.create(data).subscribe(() => {
            this._router.navigate(['/members']);
        });
    }
}
