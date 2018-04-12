import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {UploadService} from './upload.service';
import {takeUntil} from 'rxjs/operators';
import {ErrorHandler} from '../error-handler';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, OnDestroy {

  private ngUnsibscribe = new Subject();
  public threads = [];
  public count = 0;

  public from: Date;
  public to: Date;

  public Math: any;

  // DATE BELOW MUST BE IN FORMAT MM.dd.yyyy
  dateInterval = [{
      title: 'from',
      value: '01.09.2018'
  }, {
      title: 'to',
      value: '02.12.2018'
  }];

  constructor(
      public uploadService: UploadService,
      public errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    this.Math = Math;
    this.from = new Date(this.findParam('from').value);
    this.to = new Date(this.findParam('to').value);
    this.uploadService.getThreads()
        .pipe(takeUntil(this.ngUnsibscribe))
        .subscribe((response: Response) => {
          if (response['error'] === 0) {
              console.log(response);
              this.count = response['threads'].length;
              for (const thread of response['threads']) {
                  this.uploadService.getThread(thread)
                      .subscribe((responseThread: Response) => {
                          if (responseThread['error'] === 0) {
                              const threadFromResponse = responseThread['thread'];
                              this.uploadService.getThreadLogs(thread)
                                  .subscribe((responseThreadLogs: Response) => {
                                      if (responseThreadLogs['error'] === 0) {
                                          console.log(responseThreadLogs);
                                          threadFromResponse['logs'] = responseThreadLogs['logs'];
                                      } else {
                                          this.errorHandler.initError(responseThreadLogs['error'], responseThreadLogs['error_message']);
                                      }
                                  });
                              threadFromResponse.opened = false;
                              this.threads.push(threadFromResponse);
                              const threadIndex = this.threads.length - 1;
                              if (responseThread['thread']['status'] !== 'COMPLITED' && responseThread['thread']['status'] !== 'DEATH' && responseThread['thread']['status'] !== 'STOPED') {
                                  this.seekThread(threadFromResponse.id, threadIndex);
                              }
                          } else {
                              this.errorHandler.initError(responseThread['error'], responseThread['error_message']);
                          }
                      });
              }
          } else {
              this.errorHandler.initError(response['error'], response['error_message']);
          }
        });
  }

  ngOnDestroy() {
    this.ngUnsibscribe.next();
    this.ngUnsibscribe.complete();
  }

  public startThread() {
    this.uploadService.startThread({from: this.findParam('from').value, to: this.findParam('to').value})
        .subscribe((response: Response) => {
          if (response['error'] === 0) {
            console.log(response);
            const thread = response['id'];
              this.uploadService.getThread(thread)
                  .subscribe((responseThread: Response) => {
                      if (responseThread['error'] === 0) {
                          const threadFromResponse = responseThread['thread'];
                          this.uploadService.getThreadLogs(thread)
                              .subscribe((responseThreadLogs: Response) => {
                                  if (responseThreadLogs['error'] === 0) {
                                      console.log(responseThreadLogs);
                                      threadFromResponse['logs'] = responseThreadLogs['logs'];
                                  } else {
                                      this.errorHandler.initError(responseThreadLogs['error'], responseThreadLogs['error_message']);
                                  }
                              });
                          threadFromResponse.opened = false;
                          this.threads.push(threadFromResponse);
                          const threadIndex = this.threads.length - 1;
                          if (responseThread['thread']['status'] !== 'COMPLITED' && responseThread['thread']['status'] !== 'DEATH' && responseThread['thread']['status'] !== 'STOPED') {
                              this.seekThread(threadFromResponse.id, threadIndex);
                          }
                      } else {
                          this.errorHandler.initError(responseThread['error'], responseThread['error_message']);
                      }
                  });
          } else {
              this.errorHandler.initError(response['error'], response['error_message']);
          }
        });
  }

  public stopThread(id) {
      this.uploadService.stopThread(id)
          .pipe(takeUntil(this.ngUnsibscribe))
          .subscribe((response: Response) => {
              if (response['error'] === 0) {
                  console.log(response);
              } else {
                  this.errorHandler.initError(response['error'], response['error_message']);
              }
          });
  }

  public findParam(name) {
      return this.dateInterval.find(param => param.title === name);
  }

  public seekThread(id, index) {
      const context = this;
      const timer = setInterval(function () {
          context.uploadService.getThread(id)
              .subscribe((responseThread: Response) => {
                  console.log(responseThread);
                  if (responseThread['error'] === 0) {
                      const threadFromResponse = responseThread['thread'];
                      context.uploadService.getThreadLogs(id)
                          .subscribe((responseThreadLogs: Response) => {
                              if (responseThreadLogs['error'] === 0) {
                                  console.log(responseThreadLogs);
                                  threadFromResponse['logs'] = responseThreadLogs['logs'];
                                  // const newLogs = '<p>' + threadFromResponse['logs'].join('</p><p>') + '</p>';
                                  let newLogs = responseThreadLogs['logs'];
                                  if (responseThreadLogs['count'] <= responseThreadLogs['logs'].length) {
                                      newLogs = responseThreadLogs['logs'].map(function (logRecord) {
                                          return '<p>' + JSON.stringify(logRecord) + '</p>';
                                      });
                                  } else {
                                      newLogs = context.getThreadLogs(id, 2, newLogs).map(function (logRecord) {
                                          return '<p>' + JSON.stringify(logRecord) + '</p>';
                                      });
                                  }
                                  newLogs = newLogs.join('');
                                  console.log(newLogs);

                                  const logDiv = document.getElementById('thread-logs-' + id).querySelector('div');
                                  logDiv.innerHTML = newLogs;
                                  logDiv.scrollTop = logDiv.scrollHeight;
                              } else {
                                  context.errorHandler.initError(responseThreadLogs['error'], responseThreadLogs['error_message']);
                              }
                          });
                      // context.threads[index] = threadFromResponse;
                      const currentStatus = document.querySelector('#thread-' + id + ' .thread-status').innerHTML;
                      if (responseThread['thread']['status'] !== currentStatus) {
                          document.querySelector('#thread-' + id + ' .thread-status').innerHTML = responseThread['thread']['status'];
                      }

                      document.getElementById('thread-' + id).querySelector('.thread-progress').innerHTML = Math.floor(responseThread['thread']['uploaded'] / responseThread['thread']['all'] * 100) + '%';

                      if (responseThread['thread']['status'] === 'COMPLITED' || responseThread['thread']['status'] === 'DEATH' || responseThread['thread']['status'] === 'STOPED') {
                          clearTimeout(timer);
                      }
                  } else {
                      clearTimeout(timer);
                      context.errorHandler.initError(responseThread['error'], responseThread['error_message']);
                  }
              });
      }, 1000);
  }

  public getThreadLogs(id, page, newLogs): any {
      let logs = newLogs;
      this.uploadService.getThreadLogs(id, page)
          .subscribe((responseThreadLogs: Response) => {
              if (responseThreadLogs['error'] === 0) {
                  console.log(responseThreadLogs);
                  logs = logs.concat(responseThreadLogs['logs']);
                  if (responseThreadLogs['count'] > logs.length) {
                      this.getThreadLogs(id, page + 1, logs);
                  } else {
                      return logs;
                  }
                }
            });
  }

  public changeFrom(e) {
    this.findParam('from').value = ((e.getDate().toString().length === 1) ? '0' + e.getDate().toString() : e.getDate().toString()) + '.' + (((e.getMonth() + 1).toString().length === 1) ? '0' + (e.getMonth() + 1).toString() : (e.getMonth() + 1).toString()) + '.' + e.getFullYear().toString();
    console.log(((e.getDate().toString().length === 1) ? '0' + e.getDate().toString() : e.getDate().toString()) + '.' + (((e.getMonth() + 1).toString().length === 1) ? '0' + (e.getMonth() + 1).toString() : (e.getMonth() + 1).toString()) + '.' + e.getFullYear().toString());
  }

  public changeTo(e) {
    this.findParam('to').value = ((e.getDate().toString().length === 1) ? '0' + e.getDate().toString() : e.getDate().toString()) + '.' + (((e.getMonth() + 1).toString().length === 1) ? '0' + (e.getMonth() + 1).toString() : (e.getMonth() + 1).toString()) + '.' + e.getFullYear().toString();
  }

  public trackById(index: number, item): number {
    return item.id;
  }

  public showLogs(id) {
    document.getElementById('thread-logs-' + id).classList.toggle('opened');
    document.getElementById('thread-' + id).querySelector('button').innerText = (document.getElementById('thread-' + id).querySelector('button').innerText === 'Show Logs') ? 'Hide Logs' : 'Show Logs';
  }

  public rerunThread(id) {
      this.uploadService.rerunThread(id)
          .pipe(takeUntil(this.ngUnsibscribe))
          .subscribe((response: Response) => {
              if (response['error'] === 0) {
                  console.log(response);
                  this.seekThread(id, 4);
              } else {
                  this.errorHandler.initError(response['error'], response['error_message']);
              }
          });
  }

  public deleteThread(id) {
      if (confirm('Are you really want to delete thread (id = ' + id + ')?')) {
          this.uploadService.deleteThread(id)
              .pipe(takeUntil(this.ngUnsibscribe))
              .subscribe((response: Response) => {
                  if (response['error'] === 0) {
                      console.log(response);
                      document.getElementById('thread-' + id).remove();
                  } else {
                      this.errorHandler.initError(response['error'], response['error_message']);
                  }
              });
      }
  }
}
