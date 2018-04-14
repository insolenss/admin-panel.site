import {Component, Input, OnInit} from '@angular/core';
import {UserParamsService} from '../user-params.service';
import {ErrorHandler} from '../error-handler';
import {Router} from '@angular/router';
import {SpliceService} from './splice.service';
import {SplicesService} from '../splices/splices.service';

@Component({
  selector: 'app-splice',
  templateUrl: './splice.component.html',
  styleUrls: ['./splice.component.css']
})
export class SpliceComponent implements OnInit {

  @Input() id: string;

  public videoSource: any;
  public videoFile: any;
  public videoSrc: any;

  public domVideoSrc = '';

  splice: any;

  public isEdit = false;
  constructor(
      public spliceService: SpliceService,
      private errorHandler: ErrorHandler,
      public userParamsService: UserParamsService,
      public splicesService: SplicesService,
      private router: Router) { }

  ngOnInit() {
      if (this.id !== '') {
          this.initialiseSplice();
      }
  }

  public initialiseSplice() {
      this.spliceService.getSplice(this.id)
          .subscribe((splice: Response) => {
              if (splice['error'] === 0 ) {
                  this.splice = splice;

                  console.log(splice);

                  this.spliceService.getStream(this.id)
                      .subscribe((stream: Response) => {
                          this.videoSource = stream;
                          this.videoFile = new File([this.videoSource], this.id, {type: 'video/mp4'});
                          this.videoSrc = new FileReader();

                          this.videoSrc.onload = (function(file) {
                              return function(e) {
                                  const video: HTMLVideoElement = document.createElement('video');
                                  video.addEventListener('click', video.play, false);
                                  video.innerHTML = '<source type="video/mp4" src="' + e.target.result + '" />';
                                  document.getElementById('video-wrapper').innerHTML = '';
                                  document.getElementById('video-wrapper').appendChild(video);
                              };
                          })(this.videoFile);
                          this.videoSrc.readAsDataURL(this.videoFile);
                      });
              } else {
                  this.errorHandler.initError(splice['error'], splice['error_message']);
              }
          });
  }

  public closeModal() {
      this.splicesService.spliceModalOpened = false;
      this.router.navigate(['splices/']);
  }

  public deleteSplice(id) {
      if (confirm('Are you really want to delete splice? (id = ' + id + ')')) {
          this.spliceService.deleteSplice(id)
              .subscribe((response: Response) => {
                  if (response['error'] === 0) {
                      this.closeModal();
                      this.router.navigate(['splices']);
                  } else {
                      this.errorHandler.initError(response['error'], response['error_message']);
                  }
              });
      }
  }

  public makeGlobal(condition) {
      const data = {
          id: this.splice.id,
          status: condition.toString()
      };
      this.spliceService.makeGlobal(data)
          .subscribe((response: Response) => {
              if (response['error'] === 0) {
                  this.initialiseSplice();
              } else {
                  this.errorHandler.initError(response['error'], response['error_message']);
              }
          });
  }

}
