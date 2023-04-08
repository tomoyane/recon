import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {environment} from '../../environments/environment';
import {Oauth} from '../model/oauth';

@Injectable({
  providedIn: 'root'
})
export class OauthService {
  public googleProvider: GoogleAuthProvider;

  constructor() {
    firebase.auth().languageCode = environment.baseLanguage;
    this.googleProvider = new firebase.auth.GoogleAuthProvider();
    this.googleProvider.addScope('email');
  }

  public async signInGoogleAuth(): Promise<Oauth> {
    return await firebase.auth().signInWithPopup(this.googleProvider).then(result => {
      if (result.user.email === undefined || result.user.email === null || result.user.email === '') {
        return null;
      }
      if (result.user.emailVerified === undefined || result.user.emailVerified === null || !result.user.emailVerified) {
        return null;
      }

      const oauth = new Oauth();
      // @ts-ignore
      oauth.access_token = result.credential.idToken;
      return result.user.getIdToken().then(token => {
        firebase.auth().signOut();
        oauth.id_token = token;
        return oauth;
      });
    }).catch(error => {
      throw error;
    });
  }
}
