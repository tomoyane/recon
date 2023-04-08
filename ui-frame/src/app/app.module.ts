import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {AppRoutingModule} from './app-routing.module';
import {RecorderService} from './service/recorder.service';
import {MenuComponent} from './component/home/menu/menu.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {RecordingComponent} from './component/recording/recording.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {HttpClientService} from './infra/http-client.service';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {PermissionDialogComponent} from './component/home/menu/permission-dialog/permission-dialog.component';
import {HomeComponent} from './component/home/home.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CountdownComponent} from './component/countdown/countdown.component';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    RecordingComponent,
    PermissionDialogComponent,
    HomeComponent,
    CountdownComponent,
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatMenuModule,
    MatListModule,
    MatCheckboxModule,
    DragDropModule
  ],
  providers: [
    RecorderService,
    HttpClientService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // firebase.initializeApp(environment.firebase);
    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
  }
}
