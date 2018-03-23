import {Component, OnDestroy, OnInit} from '@angular/core';
import {ErrorHandler} from '../error-handler';
import {UserParamsService} from '../user-params.service';
import {SortDescriptor} from '@progress/kendo-data-query';
import {GridDataResult, PageChangeEvent} from '@progress/kendo-angular-grid';
import {SplicesService} from './splices.service';
import { ActivatedRoute } from '@angular/router';
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
      private route: ActivatedRoute
  ) { }

  public splices = [];
  public gridView: GridDataResult;
  public skip = 0;

  public total = 0;
  public sort: SortDescriptor[] = [];

  public editedSpliceId = this.route.params['value'].editedSpliceId ? this.route.params['value'].editedSplicetId : '';

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

      if (this.route.params['value'].editedFragmentId) {
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
              const fakeEvent = {target: {value: this.userParams.searchFragment}};
              // this.searchFragmentsById(fakeEvent);
          }
          if (this.userParams.searchTag) {
              this.splicesService.findParam('page').value = '1';
              // this.fragmentsService.findParam('tagid').value = this.userParams.searchTag;
          }
          if (this.userParams.searchSplice) {
              const fakeEvent = {target: {value: this.userParams.searchSplice}};
              // this.searchFragmentsById(fakeEvent);
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
      if (this.userParams.searchFragment) {
          const fakeEvent = {target: {value: this.userParams.searchFragment}};
          // this.searchFragmentsById(fakeEvent);
      } else {
          this.initialiseGrid();
      }
  }

}
