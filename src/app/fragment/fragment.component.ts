import { Component, OnInit, Injectable, Input } from '@angular/core';
import { FragmentService } from '../fragments/fragment.service';
import {ErrorHandler} from '../error-handler';
import { UserParamsService } from '../user-params.service';
import { FragmentsService } from '../fragments/fragments.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-fragment',
  templateUrl: './fragment.component.html',
  styleUrls: ['./fragment.component.css']
})

@Injectable()
export class FragmentComponent implements OnInit {

  @Input() id: string;

  public videoSource: any;
  public videoFile: any;
  public videoSrc: any;

  public domVideoSrc = '';

  fragment: any;

  public isEdit = false;

  constructor(
    public fragmentService: FragmentService,
    private errorHandler: ErrorHandler,
    public userParamsService: UserParamsService,
    public fragmentsService: FragmentsService,
    private router: Router) { }

  ngOnInit() {
    if (this.id !== '') {
      this.initialiseFragment();
    }
  }

  public initialiseFragment() {
    this.fragmentService.getFragment(this.id)
        .subscribe((fragment: Response) => {
          if (fragment['error'] === 0 ) {
              this.fragment = fragment;
              this.fragment.attributes_string = '';

              this.fragment.attributes = this.fragment.attributes.join('\n');

              this.fragmentService.getTagName(fragment['tagid'])
                .subscribe((tag: Response) => {
                  this.fragment.tagName = tag['info'].tag;
                });

              this.fragmentService.getStream(this.id)
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
              this.errorHandler.initError(fragment['error'], fragment['error_message']);
          }
        });
  }

  public closeModal() {
    this.fragmentsService.fragmentModalOpened = false;
    this.router.navigate(['fragments/']);
  }

  public saveAttributes() {
    const data = {
      id: this.fragment.id,
      attributes: this.fragment.attributes.split('\n')
    };
    this.fragmentService.saveAttributes(data)
      .subscribe((response: Response) => {
        if (response['error'] === 0) {
          this.initialiseFragment();
        } else {
          this.errorHandler.initError(response['error'], response['error_message']);
        }
      });
  }

  public makeGlobal() {
    const data = {
      id: this.fragment.id
    };
    this.fragmentService.makeGlobal(data)
      .subscribe((response: Response) => {
        if (response['error'] === 0) {
          this.initialiseFragment();
        } else {
          this.errorHandler.initError(response['error'], response['error_message']);
        }
      });
  }

  public makeAttestation() {
    const data = {
      id: this.fragment.id
    };
    this.fragmentService.makeAttestation(data)
      .subscribe((response: Response) => {
        if (response['error'] === 0) {
          this.initialiseFragment();
        } else {
          this.errorHandler.initError(response['error'], response['error_message']);
        }
      });
  }

  public makePrivate() {
    const data = {
      id: this.fragment.id
    };
    this.fragmentService.makePrivate(data)
      .subscribe((response: Response) => {
        if (response['error'] === 0) {
          this.initialiseFragment();
        } else {
          this.errorHandler.initError(response['error'], response['error_message']);
        }
      });
  }

  public changeOwner() {
    const data = {
      id: this.fragment.id,
      userid: this.fragment.ownerid
    };
    console.log(data);
    this.fragmentService.changeOwner(data)
      .subscribe((response: Response) => {
        if (response['error'] === 0) {
          this.initialiseFragment();
        } else {
          this.errorHandler.initError(response['error'], response['error_message']);
        }
      });
  }

  public deleteFragment(id) {
    if (confirm('Вы действительно хотите удалить данный фрагмент? (id = ' + id + ')')) {
        this.fragmentsService.deleteFragment({id: id})
            .subscribe((response: Response) => {
                if (response['error'] === 0) {
                    this.closeModal();
                    this.router.navigate(['fragments']);
                } else {
                    this.errorHandler.initError(response['error'], response['error_message']);
                }
        });
    }
  }
}


