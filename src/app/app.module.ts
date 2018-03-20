import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthService} from './auth.service';
import {AppGuard} from './app.guard';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {UsersService} from './users/users.service';
import {DialogsModule} from '@progress/kendo-angular-dialog';
import { UserComponent } from './user/user.component';
import {UserService} from './user/user.service';
import {Helper} from './helper';
import {Locales} from './locales';
import {UserParamsService} from './user-params.service';
import {ErrorHandler} from './error-handler';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { FragmentsComponent } from './fragments/fragments.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import {FragmentsService} from './fragments/fragments.service';
import { FragmentComponent } from './fragment/fragment.component';
import { FragmentService } from './fragments/fragment.service';
import { TagsComponent } from './tags/tags.component';
import { TagsService } from './tags/tags.service';


const appRoutes: Routes = [
    { path: '', redirectTo: '/users', pathMatch: 'full'},
    { path: 'login', component: LoginComponent},
    { path: 'users', component: UsersComponent, canActivate: [AppGuard] },
    { path: 'fragments', component: FragmentsComponent, canActivate: [AppGuard] },
    { path: 'fragments/:editedFragmentId', component: FragmentsComponent, canActivate: [AppGuard] },
    { path: 'tags', component: TagsComponent, canActivate: [AppGuard] },
    { path: '**', component: UsersComponent, canActivate: [AppGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    UserComponent,
    FragmentsComponent,
    MainMenuComponent,
    FragmentComponent,
    TagsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    BrowserAnimationsModule,
    GridModule,
    InputsModule,
    DropDownsModule,
    DialogsModule,
    DateInputsModule
  ],
  providers: [AuthService, AppGuard, UsersService, UserService, Helper, Locales, UserParamsService, ErrorHandler, FragmentsService, FragmentService, TagsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
