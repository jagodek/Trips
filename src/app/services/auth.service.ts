import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  from,
  switchMap,
  take,
  empty,
  map,
  filter,
} from 'rxjs';
import {
  SignupCredentials,
  SigninCredentials,
  User,
  settings,
} from './../interfaces';
import { AngularFireAuth,PERSISTENCE } from '@angular/fire/compat/auth';
import {
  collection,
  Firestore,
  collectionData,
  docData,
} from '@angular/fire/firestore';
import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Router } from '@angular/router';
import { compileClassMetadata } from '@angular/compiler';
import { Trip, TripLocal } from '../Trip';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  private emptyUser ={
    name: '',
    userTrips: [],
    role: '',
    banned: false,
    userId: '',
    email: '',

  }
  private userObject = new BehaviorSubject<User>(this.emptyUser);

  private authService = new BehaviorSubject<Object | null>(null);
  private isLogged=new  BehaviorSubject<boolean>(false);
  private name = new BehaviorSubject<string>('');
  private uid = new BehaviorSubject<string>('');
  coll = collection(this.db, 'users');

  settings: settings = { timeoutType: 'none', timeoutValue: -1 };

  constructor(
    private auth: AngularFireAuth,
    private db: Firestore,
    public router: Router
  ) {




    this.auth.authState.subscribe((user) => {

        if(user) {


          this.getUserByid(user.uid).pipe(take(1)).subscribe((val:User) => {
            this.setUserObject(val);
            this.setLoggedValue(true);

          });
        }
        else{

        }

    })


    this.getTimeout()
      .subscribe((val) => {
        this.settings = val;
        if (this.settings.timeoutType === 'local') {
          this.auth.setPersistence('local');
        }
        if (this.settings.timeoutType === 'session') {
          this.auth.setPersistence('session');
        }
        if (this.settings.timeoutType === 'none') {
          this.auth.setPersistence('none');
        }
              //   this.auth.authState.subscribe((user) => {
              //   if(user){
              //     this.userData = user;
              //     this.getUserByid(user.uid).subscribe((val:User) => {
              //       this.setUserObject(val);
              //     })
              //     localStorage.setItem('user', JSON.stringify(this.userData));
              //     JSON.parse(localStorage.getItem('user')!);
              //   }
              //   else {
              //     localStorage.setItem('user', 'null');
              //     JSON.parse(localStorage.getItem('user')!);
              // }
              // })
              });


  }

  getTimeout(): Observable<settings> {
    return docData(doc(this.db, '/settings', '0')) as Observable<settings>;
  }

  getLoggedValue(): Observable<boolean> {
    return this.isLogged.asObservable();
  }
  setLoggedValue(newValue: boolean): void {
    this.isLogged.next(newValue);
  }

  getUserObject(): Observable<User> {
    return this.userObject.asObservable();
  }
  setUserObject(usr: User): void {



    const docc = doc(this.db, '/users', usr.userId);
    setDoc(docc,usr);
    this.userObject.next(usr);
  }

  async signIn({ email, password }: SigninCredentials) {
    // return from(signInWithEmailAndPassword(this.auth, email, password).then((result) => {localStorage.setItem('user',JSON.stringify(result));}));

    await this.auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        this.setLoggedValue(true);
        if (res.user) {
          var id = res.user.uid;
          this.getUserByid(id).pipe(take(1)).subscribe((usr) => {
            this.setUserObject(usr);
            if(usr.role ==='admin'){
              this.router.navigate(['admin-panel'])
            }
            else if(usr.role === 'manager'){
              this.router.navigate(['manage']);
            }
            else{
              this.router.navigate(['offer']);
            }
          });
        }
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);

      });
    this.userData = this.auth.authState;


  }

  getUserByid(id: string): Observable<User> {
    return docData(doc(this.db, '/users', id)) as Observable<User>;
  }

  async signUp({ email, password, name }: SignupCredentials) {
    await this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (res) => {
        this.setLoggedValue(true);
        localStorage.setItem('user', JSON.stringify(res.user));
        alert('zarejestrowano');
        if (res.user) {
          let usr: User = {
            userTrips: [],
            name: name,
            role: 'client',
            banned: false,
            userId: res.user.uid,
            email: email,
          };
          await setDoc(doc(this.db, 'users', res.user.uid), usr);
          this.setUserObject(usr);
          this.getTimeout()
            .pipe(take(1))
            .subscribe((val) => {
              this.settings = val;
              if (this.settings.timeoutType === 'local') {
                this.auth.setPersistence('local');
              }
              if (this.settings.timeoutType === 'session') {
                this.auth.setPersistence('session');
              }
              if (this.settings.timeoutType === 'none') {
                this.auth.setPersistence('none');
              }


            });
          // addDoc(this.coll,{'userId':res.user.uid,'email':email,'role':'client'});
        }
        this.router.navigate(['offer']);
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }

      });
    this.userData = this.auth.authState;


  }

  signOut() {
    this.auth.signOut();
    this.router.navigate(['signin']);
    this.userData = this.auth.authState;
    alert('wylogowano');
    this.setLoggedValue(false);
    this.setUserObject(this.emptyUser);
  }

  isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);

    return user !== null;
  }

  expireDate = new Date();

  handleUser() {
    if (this.isLogged.value) {
      this.expireDate = new Date(new Date().getTime());
      this.expireDate.setMilliseconds(
        this.expireDate.getMilliseconds() + this.settings.timeoutValue
      );
    }
  }

  autoLogout() {
    setTimeout(() => {
      const now = new Date();
      const diff = this.expireDate.valueOf() - now.valueOf();


      if (diff <= 0 && this.isLogged.value) {
        this.signOut();
        this.router.navigate(['signin']);
      }
    }, this.settings.timeoutValue);
  }

  getUserList(): Observable<User[]> {
    const source = collectionData(this.coll, { idField: 'id' }) as Observable<
      User[]
    >;
    return source;
  }

  updateUser(user: User) {
    const dc = doc(this.db, '/users', user.userId);
    setDoc(dc, user);
  }

  updatePers(newVal: settings){

    this.auth.setPersistence(newVal.timeoutType);
    this.settings = newVal;
    const dc = doc(this.db, '/settings', '0');
    setDoc(dc, this.settings);
  }


  canComment(user:User,trip:TripLocal){
    for(let i = 0; i<user.userTrips.length;i++){
      if(user.userTrips[i].id === trip.id){
        for(let j =0; j<trip.reviews.length ;j++){
          if(user.userId === trip.reviews[i].id){
            return false;
          }
        }
        if(user.userTrips[i].state === 'realized')
          return true;
      }
    }
    return false;
  }

}
