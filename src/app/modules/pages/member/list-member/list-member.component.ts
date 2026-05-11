import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'app/core/user/user.service';
import { ConfirmService } from 'app/services/confirm.service';
import { MemberService } from 'app/services/member.service';

@Component({
    selector: 'app-list-member',
    templateUrl: './list-member.component.html',
})
export class ListMemberComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = [
        'memberNo',
        'fullName',
        'phoneNumber',
        'memberType',
        'actions',
    ];

    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

    formGroup!: FormGroup;

    searchResult: any[] = [];

    @Input() isModal = false;

    @Output() onSelectedMember = new EventEmitter<any>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    role!: string;

    constructor(
        private _fb: FormBuilder,
        private confirmService: ConfirmService,
        private _memberService: MemberService,
        private _userService: UserService,
    ) {}

    ngOnInit(): void {
        this.formGroup = this._fb.group({
            fullName: '',
            phoneNumber: '',
            memberNo: '',
        });

        this._userService.get().subscribe(({ role }) => {
            this.role = role;
        });

        this.reloadData();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    reloadData() {
        this._memberService
            .getAll(this.formGroup.value)
            .subscribe((result: any) => {
                this.searchResult = this.dataSource.data = result;
            });
    }

    selectMember(element: any) {
        this.onSelectedMember.emit(element);
    }

    removeItem(id: string) {
        this.confirmService
            .confirm('Are you sure to delete?')
            .beforeClosed()
            .subscribe(
                (value) => value === 'confirmed' && this.confirmRemoveItem(id),
            );
    }

    private confirmRemoveItem(id: string) {
        this._memberService.remove(id).subscribe(() => {
            this.confirmService
                .success('Member has been successfully deleted')
                .afterOpened()
                .subscribe(() => this.reloadData());
        });
    }
}
