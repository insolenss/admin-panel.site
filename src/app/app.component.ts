import { Component } from '@angular/core';
import {ErrorHandler} from './error-handler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor (public errorHandler: ErrorHandler) {}
}
