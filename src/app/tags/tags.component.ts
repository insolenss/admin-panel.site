import {Component, OnDestroy, OnInit} from '@angular/core';
import { TagsService } from './tags.service';
import { ErrorHandler } from '../error-handler';
import { UserParamsService } from '../user-params.service';
import { ActivatedRoute } from '@angular/router';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query/dist/es/main';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();
  constructor(
    public tagsService: TagsService,
    private errorHandler: ErrorHandler,
    public userParams: UserParamsService,
    private route: ActivatedRoute
  ) { }

  public tags = [];
  public gridView: GridDataResult;
  public skip = 0;

  public total = 0;
  public sort: SortDescriptor[] = [];

  public from: Date;
  public to: Date;

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
    this.from = new Date(+(this.tagsService.findParam('from').value) * 1000);
    this.to = new Date(+(this.tagsService.findParam('to').value) * 1000);

    this.tags.length = 0;
    this.skip = (+(this.tagsService.findParam('page').value) - 1) * +(this.tagsService.findParam('pagesize').value);

    if (this.userParams.searchTag) {
        const fakeEvent = {target: {value: this.userParams.searchTag}};
        this.searchTagById(fakeEvent);
    } else {
        this.tagsService.getTags()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: Response) => {
                console.log(response);
                if (response['error'] === 0) {
                    this.total = response['count'];
                    for (const tag of response['tags']) {
                        this.tagsService.getTag(tag)
                            .pipe(takeUntil(this.ngUnsubscribe))
                            .subscribe((responseTag: Response) => {
                                if (responseTag['error'] === 0) {
                                    console.log(responseTag);
                                    this.tags.push(responseTag['info']);
                                } else {
                                    this.errorHandler.initError(responseTag['error'], responseTag['error_message']);
                                }
                            });
                    }
                    this.gridView = {
                        data: this.tags,
                        total: response['count']
                    };
                } else {
                    this.errorHandler.initError(response['error'], response['error_message']);
                }
            });
    }

  }

    public changeFrom(event) {
        this.tagsService.findParam('page').value = '1';
        this.tagsService.findParam('from').value = (event.getTime() / 1000).toString();
        this.initialiseGrid();
    }

    public changeTo(event) {
        this.tagsService.findParam('page').value = '1';
        this.tagsService.findParam('to').value = (event.getTime() / 1000).toString();
        this.initialiseGrid();
    }

    public pageChange(state: PageChangeEvent): void {
        this.tagsService.findParam('page').value = (state.skip / Number(this.tagsService.findParam('pagesize').value) + 1).toString();
        this.initialiseGrid();
    }

    public pageSizeChange(event) {
        this.tagsService.findParam('page').value = '1';
        this.tagsService.findParam('pagesize').value = event.target.value;
        this.initialiseGrid();
    }

    public sortChange(sort: SortDescriptor[]): void {
        this.tagsService.findParam('page').value = '1';
        this.sort = sort;
        this.tagsService.findParam('sorted').value = (sort[0].dir === 'asc' ? '' : '-') + sort[0].field;
        this.initialiseGrid();
    }

    public searchTagById(event) {
        if (event.target.value !== '') {
            this.tagsService.findParam('page').value = '1';
            this.tags.length = 0;
            this.tagsService.getTag(event.target.value)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((response: Response) => {
                    console.log(response);
                    if (response['error'] === 0) {
                        this.tags.push(response['info']);
                        this.gridView = {
                            data: this.tags,
                            total: this.tags.length
                        };
                    } else {
                        this.errorHandler.initError(response['error'], response['error_message']);
                    }
                });
        } else {
            this.initialiseGrid();
        }
    }

}
