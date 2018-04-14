import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserParamsService} from '../user-params.service';
import {ErrorHandler} from '../error-handler';
import {GridDataResult, PageChangeEvent} from '@progress/kendo-angular-grid';
import {Subject} from 'rxjs/Subject';
import {ActivatedRoute} from '@angular/router';
import {RatingsService} from './ratings.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();
  constructor(
      public ratingsService: RatingsService,
      private errorHandler: ErrorHandler,
      public userParams: UserParamsService,
      private route: ActivatedRoute
  ) { }

  public ratings = [];
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

      this.ratings.length = 0;
      this.skip = (+(this.ratingsService.findParam('page').value) - 1) * +(this.ratingsService.findParam('pagesize').value);

      this.ratingsService.getRatings()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((response: Response) => {
              console.log(response);
              if (response['error'] === 0) {
                  this.total = response['count'];
                  this.ratings = response['ratings'];

                  this.gridView = {
                      data: this.ratings,
                      total: response['count']
                  };
              } else {
                  this.errorHandler.initError(response['error'], response['error_message']);
              }
          });

  }

  public pageChange(state: PageChangeEvent): void {
      this.ratingsService.findParam('page').value = (state.skip / Number(this.ratingsService.findParam('pagesize').value) + 1).toString();
      this.initialiseGrid();
  }

  public pageSizeChange(event) {
      this.ratingsService.findParam('page').value = '1';
      this.ratingsService.findParam('pagesize').value = event.target.value;
      this.initialiseGrid();
  }

  public deleteRating(id) {
    this.ratingsService.deleteRating(id)
        .subscribe((response: Response) => {
          if (response['error'] === 0) {
            this.initialiseGrid();
          } else {
            this.errorHandler.initError(response['error'], response['error_message']);
          }
        });
  }

}
