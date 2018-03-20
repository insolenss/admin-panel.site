import { Component, OnInit } from '@angular/core';
import {ErrorHandler} from '../error-handler';
import {UserParamsService} from '../user-params.service';
import {SortDescriptor} from '@progress/kendo-data-query';
import {GridDataResult, PageChangeEvent} from '@progress/kendo-angular-grid';
import {FragmentsService} from './fragments.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fragments',
  templateUrl: './fragments.component.html',
  styleUrls: ['./fragments.component.css']
})
export class FragmentsComponent implements OnInit {

  constructor(
      public fragmentsService: FragmentsService,
      private errorHandler: ErrorHandler,
      public userParams: UserParamsService,
      private route: ActivatedRoute
  ) { }

    public fragments = [];
    public gridView: GridDataResult;
    public skip = 0;

    public total = 0;
    public sort: SortDescriptor[] = [];

    public editedFragmentId = this.route.params['value'].editedFragmentId ? this.route.params['value'].editedFragmentId : '';

    public from: Date;
    public to: Date;

    ngOnInit() {
        this.fragmentsService.fragmentModalOpened = false;
        this.userParams.searchUserSubject.subscribe((id: String) => this.initialiseGrid());
        this.initialiseGrid();
    }

    public initialiseGrid(): void {

        if (this.route.params['value'].editedFragmentId) {
            this.fragmentsService.fragmentModalOpened = true;
        }



        this.from = new Date(+(this.fragmentsService.findParam('from').value) * 1000);
        this.to = new Date(+(this.fragmentsService.findParam('to').value) * 1000);

        this.fragments.length = 0;
        this.skip = (+(this.fragmentsService.findParam('page').value) - 1) * +(this.fragmentsService.findParam('pagesize').value);

        if (this.userParams.searchFragment || this.userParams.searchUser || this.userParams.searchTag || this.userParams.searchSplice) {
            if (this.userParams.searchUser) {
                const fakeEvent = {target: {value: this.userParams.searchUser}};
                this.searchFragmentsByOwnerId(fakeEvent);
            }
            if (this.userParams.searchFragment) {
                const fakeEvent = {target: {value: this.userParams.searchFragment}};
                this.searchFragmentsById(fakeEvent);
            }
            if (this.userParams.searchTag) {
                const fakeEvent = {target: {value: this.userParams.searchTag}};
                this.searchFragmentByTagId(fakeEvent);
            }

            // Check if will used
            if (this.userParams.searchSplice) {
                const fakeEvent = {target: {value: this.userParams.searchSplice}};
                this.searchFragmentsById(fakeEvent);
            }
        } else {
            this.fragmentsService.getFragments()
                .subscribe((response: Response) => {
                    console.log(response);
                    if (response['error'] === 0) {
                        this.total = response['count'];
                        for (const fragment of response['fragments']) {
                            this.fragmentsService.getFragment(fragment)
                                .subscribe((responseFragment: Response) => {
                                    if (responseFragment['error'] === 0) {
                                        console.log(responseFragment);
                                        this.fragments.push(responseFragment);
                                    } else {
                                        this.errorHandler.initError(responseFragment['error'], responseFragment['error_message']);
                                    }
                                });
                        }
                        this.gridView = {
                            data: this.fragments,
                            total: response['count']
                        };
                    } else {
                        this.errorHandler.initError(response['error'], response['error_message']);
                    }
                });
        }
    }

    public searchFragmentsById(event) {
        if (event.target.value !== '') {
            this.fragments.length = 0;
            this.fragmentsService.getFragment(event.target.value)
                .subscribe((responseFragment: Response) => {
                    if (responseFragment['error'] === 0) {
                        this.fragments.push(responseFragment);
                    } else {
                        this.errorHandler.initError(responseFragment['error'], responseFragment['error_message']);
                    }
                });
            this.gridView = {
                data: this.fragments,
                total: this.fragments.length
            };
        } else {
            this.initialiseGrid();
        }
    }

    public searchFragmentsByOwnerId(event) {
        this.fragmentsService.findParam('page').value = '1';
        this.fragmentsService.findParam('ownerid').value = event.target.value;
        this.initialiseGrid();
    }

    public searchFragmentByTagId(event) {
        this.fragmentsService.findParam('page').value = '1';
        this.fragmentsService.findParam('tagid').value = event.target.value;
        this.initialiseGrid();
    }

    public searchFragmentsByForeignId(event) {
        this.fragmentsService.findParam('page').value = '1';
        this.fragmentsService.findParam('foreign_id').value = event.target.value;
        this.initialiseGrid();
    }

    public searchFragmentsByForeignMovieId(event) {
        this.fragmentsService.findParam('page').value = '1';
        this.fragmentsService.findParam('foreign_movieid').value = event.target.value;
        this.initialiseGrid();
    }

    public changeFrom(event) {
        this.fragmentsService.findParam('page').value = '1';
        this.fragmentsService.findParam('from').value = (event.getTime() / 1000).toString();
        this.initialiseGrid();
    }

    public changeTo(event) {
        this.fragmentsService.findParam('page').value = '1';
        this.fragmentsService.findParam('to').value = (event.getTime() / 1000).toString();
        this.initialiseGrid();
    }

    public statusChange(event) {
        this.fragmentsService.findParam('page').value = '1';
        this.fragmentsService.findParam('status').value = event.join();
        this.initialiseGrid();
    }

    public pageChange(state: PageChangeEvent): void {
        this.fragmentsService.findParam('page').value = (state.skip / Number(this.fragmentsService.findParam('pagesize').value) + 1).toString();
        this.initialiseGrid();
    }

    public pageSizeChange(event) {
        this.fragmentsService.findParam('page').value = '1';
        this.fragmentsService.findParam('pagesize').value = event.target.value;
        this.initialiseGrid();
    }

    public sortChange(sort: SortDescriptor[]): void {
        this.fragmentsService.findParam('page').value = '1';
        this.sort = sort;
        this.fragmentsService.findParam('sorted').value = (sort[0].dir === 'asc' ? '' : '-') + sort[0].field;
        this.initialiseGrid();
    }

    public deleteFragment(id) {
        if (confirm('Вы действительно хотите удалить данный фрагмент? (id = ' + id + ')')) {
            this.fragmentsService.deleteFragment({id: id})
                .subscribe((response: Response) => {
                    if (response['error'] === 0) {
                        this.initialiseGrid();
                    } else {
                        this.errorHandler.initError(response['error'], response['error_message']);
                    }
            });
        }
    }

    public editFragment(id) {
        this.fragmentsService.fragmentModalOpened = true;
        this.editedFragmentId = id;
    }

}
