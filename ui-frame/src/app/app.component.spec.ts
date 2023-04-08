import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RecorderService} from './service/recorder.service';
import * as firebase from 'firebase';
import {environment} from '../environments/environment';
import {PermissionService} from './service/permission.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        RecorderService,
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestUtil.initializeFirebase();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

export class TestUtil {
  public static firebaseClient = null;
  public static initializeFirebase() {
    if (TestUtil.firebaseClient === null) {
      firebase.initializeApp(environment.firebase);
    }
  }
}
