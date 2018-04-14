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

      this.handlesService.getHandles()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((response: Response) => {
              console.log(response);
              if (response['error'] === 0) {
                  this.handlesService.getHandleCauses()
                      .subscribe((causes: Response) => {
                          if (causes['error'] === 0) {
                              this.total = response['count'];
                              this.handles = this.rebuildArray(response['handles'], causes['causes']);
                              this.gridView = {
                                  data: this.handles,
                                  total: response['count']
                              };
                              console.log(this.gridView);
                          } else {
                              this.errorHandler.initError(causes['error'], causes['error_message']);
                          }
                      });
              } else {
                  this.errorHandler.initError(response['error'], response['error_message']);
              }
          });
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

  private rebuildArray(arr, causes) {
      const newArr = [];
      for (let userIndex = 0; userIndex <= arr.length - 1; userIndex++) {
          console.log(arr[userIndex]);
          const userId = arr[userIndex].userid;
          for (let userHandleIndex = 0; userHandleIndex <= arr[userIndex].user_handles.length - 1; userHandleIndex++) {
              const newRecord = {
                  userid: userId,
                  handleType: arr[userIndex].user_handles[userHandleIndex].type,
                  handleId: arr[userIndex].user_handles[userHandleIndex].id,
                  handleCause: causes.find(param => param.id === arr[userIndex].user_handles[userHandleIndex].source.cause).locale.eng,
                  sourceType: arr[userIndex].user_handles[userHandleIndex].source.type,
                  sourceId: arr[userIndex].user_handles[userHandleIndex].source.resid,
                  text: arr[userIndex].user_handles[userHandleIndex].source.text
              };
              newArr.push(newRecord);
          }
      }
      return newArr;
  }

  public showFeedbackForm(dataItem) {
      const form = document.getElementById('feedback-form');
      document.getElementById('users-handle-text').innerHTML = dataItem.text;
      document.getElementById('feedback-send-button').setAttribute('data-userid', dataItem.userid);
      document.getElementById('feedback-send-button').setAttribute('data-handleid', dataItem.handleId);
      form.style.display = 'block';
  }

  public closeFeedbackForm() {
      document.getElementById('feedback-form').style.display = 'none';
      document.getElementById('users-handle-text').innerHTML = '';
      document.getElementById('send-success').style.display = 'none';
      this.initialiseGrid();
  }

  public sendFeedback(event) {
      const userid = event.target.getAttribute('data-userid');
      const handleid = event.target.getAttribute('data-handleid');
      const text = (<HTMLInputElement>document.getElementById('feedback')).value;
      const data = {
          userid: userid,
          id: +handleid,
          feedback: text
      };
      this.handlesService.sendFeedback(data)
          .subscribe((response: Response) => {
              if (response['error'] === 0) {
                  document.getElementById('send-success').style.display = 'block';
                  (<HTMLInputElement>document.getElementById('feedback')).value = '';
              } else {
                  this.errorHandler.initError(response['error'], response['error_message']);
              }
          });
  }

}
