import {Component, OnDestroy, OnInit} from '@angular/core';
import {ErrorHandler} from '../error-handler';
import {UserParamsService} from '../user-params.service';
import {GridDataResult, PageChangeEvent} from '@progress/kendo-angular-grid';
import {SortDescriptor} from '@progress/kendo-data-query';
import {Subject} from 'rxjs/Subject';
import {ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {HandlesService} from './handles.service';

@Component({
  selector: 'app-handles',
  templateUrl: './handles.component.html',
  styleUrls: ['./handles.component.css']
})
export class HandlesComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();
  constructor(
      public handlesService: HandlesService,
      private errorHandler: ErrorHandler,
      public userParams: UserParamsService,
      private route: ActivatedRoute
  ) { }

  public handles = [];
  public gridView: GridDataResult;
  public skip = 0;

  public total = 0;

  ngOnInit() {
      this.userParams.searchUserSubject
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((id: String) => this.initialiseGrid());
      this.initialiseGrid();
  }

  ngOnDestroy() {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
  }

  public initialiseGrid(): void {
      this.handles.length = 0;
      this.skip = (+(this.handlesService.findParam('page').value) - 1) * +(this.handlesService.findParam('pagesize').value);

      if (this.userParams.searchUser) {
          // const fakeEvent = {target: {value: this.userParams.searchTag}};
          // this.searchTagById(fakeEvent);
      } else {
          this.handlesService.getHandles()
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((response: Response) => {
                  console.log(response);
                  if (response['error'] === 0) {
                      this.total = response['count'];
                      this.gridView = {
                          data: this.handles,
                          total: response['count']
                      };
                  } else {
                      this.errorHandler.initError(response['error'], response['error_message']);
                  }
              });
      }

  }

  public pageChange(state: PageChangeEvent): void {
      this.handlesService.findParam('page').value = (state.skip / Number(this.handlesService.findParam('pagesize').value) + 1).toString();
      this.initialiseGrid();
  }

  public pageSizeChange(event) {
      this.handlesService.findParam('page').value = '1';
      this.handlesService.findParam('pagesize').value = event.target.value;
      this.initialiseGrid();
  }

}
