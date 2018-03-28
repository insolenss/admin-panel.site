import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersService} from './users.service';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

import {
    GridDataResult,
    DataStateChangeEvent,
    PageChangeEvent
} from '@progress/kendo-angular-grid';
import {Router} from '@angular/router';
import {ErrorHandler} from '../error-handler';
import {UserParamsService} from '../user-params.service';
import { FragmentsService } from '../fragments/fragments.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

    private ngUnsubscribe = new Subject();

    constructor(
        public usersService: UsersService,
        private errorHandler: ErrorHandler,
        public userParamsService: UserParamsService,
        private fragmentsService: FragmentsService
    ) { }

    public users = [];
    public gridView: GridDataResult;
    public skip = 0;

    public ignoreDateFilters = false;

    public total = 0;
    public sort: SortDescriptor[] = [];

    public userModalOpened = false;
    public editedUserId = '';

    public last_login_from: Date;
    public last_login_to: Date;

    ngOnInit() {
        this.userParamsService.searchUserSubject
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((id: String) => this.initialiseGrid());
        this.initialiseGrid();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public initialiseGrid(): void {
        this.last_login_from = new Date(+(this.usersService.findParam('lastlogin_from').value) * 1000);
        this.last_login_to = new Date(+(this.usersService.findParam('lastlogin_to').value) * 1000);

        this.users.length = 0;
        this.skip = (+(this.usersService.findParam('page').value) - 1) * +(this.usersService.findParam('pagesize').value);

        this.ignoreDateFilters = this.usersService.useDateFilters;

        if (this.userParamsService.searchFragment || this.userParamsService.searchUser || this.userParamsService.searchTag || this.userParamsService.searchSplice) {
            if (this.userParamsService.searchUser) {
                const fakeEvent = {target: {value: this.userParamsService.searchUser}};
                this.searchUsersById(fakeEvent);
            }
            if (this.userParamsService.searchFragment) {
                this.searchUsersByTagId(this.userParamsService.searchFragment);
            }
        } else {
            this.usersService.getUsers()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: Response) => {
                console.log(response);
                if (response['error'] === 0) {
                    this.total = response['count'];
                    for (const user of response['users']) {
                        this.usersService.getUser(user)
                            .pipe(takeUntil(this.ngUnsubscribe))
                            .subscribe((responseUser: Response) => {
                                if (responseUser['error'] === 0) {
                                    console.log(responseUser);
                                    this.users.push(responseUser);
                                } else {
                                    this.errorHandler.initError(responseUser['error'], responseUser['error_message']);
                                }
                            });
                    }
                    this.gridView = {
                        data: this.users,
                        total: response['count']
                    };
                } else {
                    this.errorHandler.initError(response['error'], response['error_message']);
                }
            });
        }
    }

    public pageChange(state: PageChangeEvent): void {
        this.usersService.findParam('page').value = (state.skip / Number(this.usersService.findParam('pagesize').value) + 1).toString();
        this.initialiseGrid();
    }

    public pageSizeChange(event) {
        this.usersService.findParam('page').value = '1';
        this.usersService.findParam('pagesize').value = event.target.value;
        this.initialiseGrid();
    }

    public sortChange(sort: SortDescriptor[]): void {
        this.usersService.findParam('page').value = '1';
        this.sort = sort;
        if (sort[0].dir) {
            this.usersService.findParam('sorted').value = (sort[0].dir === 'asc' ? '' : '-') + sort[0].field;
        } else {
            this.usersService.findParam('sorted').value = '';
        }
        this.initialiseGrid();
    }

    public searchUsersByName(event) {
        this.usersService.findParam('page').value = '1';
        this.usersService.findParam('username').value = event.target.value;
        this.initialiseGrid();
    }

    public searchUsersByEmail(event) {
        this.usersService.findParam('page').value = '1';
        this.usersService.findParam('email').value = event.target.value;
        this.initialiseGrid();
    }

    public searchUsersById(event) {
        if (event.target.value !== '') {
            this.usersService.findParam('page').value = '1';
            this.users.length = 0;
            this.usersService.getUser(event.target.value)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((responseUser: Response) => {
                    if (responseUser['error'] === 0) {
                        this.users.push(responseUser);
                        this.gridView = {
                            data: this.users,
                            total: this.users.length
                        };
                    } else {
                        this.errorHandler.initError(responseUser['error'], responseUser['error_message']);
                    }
                });
        } else {
            this.initialiseGrid();
        }
    }

    public enableChange(event) {
        this.usersService.findParam('page').value = '1';
        this.usersService.findParam('enable').value = event;
        this.initialiseGrid();
    }

    public accessChange(event) {
        this.usersService.findParam('page').value = '1';
        this.usersService.findParam('access_level').value = event.join();
        this.initialiseGrid();
    }

    public deleteUser(id) {
        if (confirm('Вы действительно хотите удалить данного пользователя? (id = ' + id + ')')) {
            this.usersService.deleteUser({
                type: 'id',
                userid: id
            })
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((response: Response) => {
                if (response['error'] === 0) {
                    this.initialiseGrid();
                } else {
                    this.errorHandler.initError(response['error'], response['error_message']);
                }
            });
        }
    }

    public editUser(id) {
        this.userModalOpened = true;
        this.editedUserId = id;
    }

    public closeModal() {
        this.userModalOpened = false;
        this.initialiseGrid();
    }

    public changeLastLoginFrom(event) {
        this.usersService.findParam('page').value = '1';
        this.usersService.findParam('lastlogin_from').value = (event.getTime() / 1000).toString();
        this.initialiseGrid();
    }

    public changeLastLoginTo(event) {
        this.usersService.findParam('page').value = '1';
        this.usersService.findParam('lastlogin_to').value = (event.getTime() / 1000).toString();
        this.initialiseGrid();
    }

    public searchUsersByTagId(id) {
        console.log(id);
        this.usersService.findParam('page').value = '1';
        this.users.length = 0;

        this.fragmentsService.getFragment(id)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((fragment: Response) => {
                if (fragment['error'] === 0) {
                    console.log(fragment);
                    this.usersService.getUser(fragment['ownerid'])
                        .pipe(takeUntil(this.ngUnsubscribe))
                        .subscribe((responseUser: Response) => {
                            if (responseUser['error'] === 0) {
                                this.users.push(responseUser);

                                this.gridView = {
                                    data: this.users,
                                    total: this.users.length
                                };
                            } else {
                                this.errorHandler.initError(responseUser['error'], responseUser['error_message']);
                            }
                        });
                } else {
                    this.errorHandler.initError(fragment['error'], fragment['error_message']);
                }
            });
    }

    public UseDateFilters() {
        this.usersService.useDateFilters = !this.usersService.useDateFilters;
        this.initialiseGrid();
    }
}
