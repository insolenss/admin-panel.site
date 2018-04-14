import {Component, OnDestroy, OnInit} from '@angular/core';
import {ErrorHandler} from '../error-handler';
import {UserParamsService} from '../user-params.service';
import {SortDescriptor} from '@progress/kendo-data-query';
import {GridDataResult, PageChangeEvent} from '@progress/kendo-angular-grid';
import {SplicesService} from './splices.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-splices',
  templateUrl: './splices.component.html',
  styleUrls: ['./splices.component.css']
})
export class SplicesComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();

  constructor(
      public splicesService: SplicesService,
      private errorHandler: ErrorHandler,
      public userParams: UserParamsService,
      private route: ActivatedRoute,
      private router: Router
  ) { }

  public splices = [];
  public gridView: GridDataResult;
  public skip = 0;

  public total = 0;
  public sort: SortDescriptor[] = [];

  public editedSpliceId = this.route.params['value'].editedSpliceId ? this.route.params['value'].editedSpliceId : '';

  public from: Date;
  public to: Date;

  ngOnInit() {
      this.splicesService.spliceModalOpened = false;
      this.userParams.searchUserSubject
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((id: String) => this.reInitialiseGrid());
      this.initialiseGrid();
  }

  ngOnDestroy() {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
  }

  public initialiseGrid(): void {

      if (this.route.params['value'].editedSpliceId) {
          this.splicesService.spliceModalOpened = true;
      }

      this.from = new Date(+(this.splicesService.findParam('from').value) * 1000);
      this.to = new Date(+(this.splicesService.findParam('to').value) * 1000);

      this.splices.length = 0;
      this.skip = (+(this.splicesService.findParam('page').value) - 1) * +(this.splicesService.findParam('pagesize').value);

      if (this.userParams.searchFragment || this.userParams.searchUser || this.userParams.searchTag || this.userParams.searchSplice) {
          if (this.userParams.searchUser) {
              this.splicesService.findParam('page').value = '1';
              this.splicesService.findParam('ownerid').value = this.userParams.searchUser;
          }
          if (this.userParams.searchFragment) {
              this.splicesService.findParam('page').value = '1';
              this.splicesService.findParam('fragid').value = this.userParams.searchUser;
          }
          if (this.userParams.searchTag) {
              this.splicesService.findParam('page').value = '1';
              this.splicesService.findParam('tagid').value = this.userParams.searchUser;
          }
          if (this.userParams.searchSplice) {
              const fakeEvent = {target: {value: this.userParams.searchSplice}};
              this.searchSplicesById(fakeEvent);
          }
      }
      this.splicesService.getSplices()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((response: Response) => {
              console.log(response);
              if (response['error'] === 0) {
                  this.total = response['count'];
                  for (const splice of response['splices']) {
                      this.splicesService.getSplice(splice)
                          .pipe(takeUntil(this.ngUnsubscribe))
                          .subscribe((responseSplice: Response) => {
                              if (responseSplice['error'] === 0) {
                                  console.log(responseSplice);
                                  this.splices.push(responseSplice);
                              } else {
                                  this.errorHandler.initError(responseSplice['error'], responseSplice['error_message']);
                              }
                          });
                  }
                  this.gridView = {
                      data: this.splices,
                      total: response['count']
                  };
              } else {
                  this.errorHandler.initError(response['error'], response['error_message']);
              }
          });
  }

  public reInitialiseGrid() {
      this.splicesService.findParam('ownerid').value = '';
      this.splicesService.findParam('tagid').value = '';
      this.splicesService.findParam('fragid').value = '';
      if (this.userParams.searchFragment || this.userParams.searchUser || this.userParams.searchTag || this.userParams.searchSplice) {
          if (this.userParams.searchUser) {
              this.splicesService.findParam('page').value = '1';
              this.splicesService.findParam('ownerid').value = this.userParams.searchUser;
              this.initialiseGrid();
          }
          if (this.userParams.searchFragment) {
              this.splicesService.findParam('page').value = '1';
              this.splicesService.findParam('fragid').value = this.userParams.searchUser;
              this.initialiseGrid();
          }
          if (this.userParams.searchTag) {
              this.splicesService.findParam('page').value = '1';
              this.splicesService.findParam('tagid').value = this.userParams.searchUser;
              this.initialiseGrid();
          }
          if (this.userParams.searchSplice) {
              const fakeEvent = {target: {value: this.userParams.searchSplice}};
              this.searchSplicesById(fakeEvent);
          }
      } else {
          this.initialiseGrid();
      }
  }

    public searchSplicesById(event) {
        if (event.target.value !== '') {
            this.splices.length = 0;
            this.splicesService.getSplice(event.target.value)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((responseSplice: Response) => {
                    if (responseSplice['error'] === 0) {
                        this.splices.push(responseSplice);
                    } else {
                        this.errorHandler.initError(responseSplice['error'], responseSplice['error_message']);
                    }
                });
            this.gridView = {
                data: this.splices,
                total: this.splices.length
            };
        } else {
            this.initialiseGrid();
        }
    }

    public searchSplicesByOwnerId(event) {
        this.splicesService.findParam('page').value = '1';
        this.splicesService.findParam('ownerid').value = event.target.value;
        this.initialiseGrid();
    }

    public searchSplicesByTagId(event) {
        this.splicesService.findParam('page').value = '1';
        this.splicesService.findParam('tagid').value = event.target.value;
        this.initialiseGrid();
    }

    public searchSplicesByFragId(event) {
        this.splicesService.findParam('page').value = '1';
        this.splicesService.findParam('fragid').value = event.target.value;
        this.initialiseGrid();
    }

    public changeFrom(event) {
        this.splicesService.findParam('page').value = '1';
        this.splicesService.findParam('from').value = (event.getTime() / 1000).toString();
        this.initialiseGrid();
    }

    public changeTo(event) {
        this.splicesService.findParam('page').value = '1';
        this.splicesService.findParam('to').value = (event.getTime() / 1000).toString();
        this.initialiseGrid();
    }

    public statusChange(event) {
        this.splicesService.findParam('page').value = '1';
        this.splicesService.findParam('status').value = event.join();
        this.initialiseGrid();
    }

    public pageChange(state: PageChangeEvent): void {
        this.splicesService.findParam('page').value = (state.skip / Number(this.splicesService.findParam('pagesize').value) + 1).toString();
        this.initialiseGrid();
    }

    public pageSizeChange(event) {
        this.splicesService.findParam('page').value = '1';
        this.splicesService.findParam('pagesize').value = event.target.value;
        this.initialiseGrid();
    }

    public sortChange(sort: SortDescriptor[]): void {
        this.splicesService.findParam('page').value = '1';
        this.sort = sort;
        this.splicesService.findParam('sorted').value = (sort[0].dir === 'asc' ? '' : '-') + sort[0].field;
        this.initialiseGrid();
    }

    public deleteSplice(id) {
        if (confirm('Are you really want to delete splice? (id = ' + id + ')')) {
            this.splicesService.deleteSplice({id: id})
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

    public editSplice(id) {
        this.splicesService.spliceModalOpened = true;
        this.editedSpliceId = id;
        this.router.navigate(['splices/' + id]);
    }

}
