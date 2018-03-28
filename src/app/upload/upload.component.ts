import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {UploadService} from './upload.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, OnDestroy {

  private ngUnsibscribe = new Subject();
  public threads = [];

  constructor(
      public uploadService: UploadService
  ) { }

  ngOnInit() {
    this.uploadService.getThreads()
        .pipe(takeUntil(this.ngUnsibscribe))
        .subscribe((response: Response) => {
          console.log(response);
        });
  }

  ngOnDestroy() {
    this.ngUnsibscribe.next();
    this.ngUnsibscribe.complete();
  }
}
