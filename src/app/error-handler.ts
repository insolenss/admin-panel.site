import {Router} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable()
export class ErrorHandler {
    public hasError = false;
    public errorMessage = '';

    constructor (private router: Router) {}

    public initError(error, errorMessage) {
        if (error === 601) {
            this.router.navigate(['login']);
        }
        this.errorMessage = 'Error: ' + error + ' Error message: ' + errorMessage;
        this.hasError = true;
    }
}
