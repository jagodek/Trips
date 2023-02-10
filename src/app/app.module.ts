import { NgModule,LOCALE_ID} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatCommonModule, MAT_DATE_LOCALE,MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import 'moment/locale/pl'

import { DatePipe, registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
registerLocaleData(localePl);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { TripsListComponent } from './components/trips-list/trips-list.component';
import { TripTileComponent } from './components/trip-tile/trip-tile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TruncatePipe } from './TruncatePipe';
import { AddTripComponent } from './components/add-trip/add-trip.component';
import { FilterTripsComponent } from './components/filter-trips/filter-trips.component';
import { FilterPipe } from './FilterPipe';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { TripDetailsComponent } from './components/trip-details/trip-details.component';



import { FirestoreModule, provideFirestore,getFirestore } from '@angular/fire/firestore';
import { FirebaseAppModule, initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { AuthModule } from '@angular/fire/auth';

import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { AuthGuardModule } from '@angular/fire/auth-guard';
import { Err404Component } from './components/err404/err404.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TripsListComponent,
    TripTileComponent,
    TruncatePipe,
    AddTripComponent,
    FilterTripsComponent,
    FilterPipe,
    HomeComponent,
    CartComponent,
    TripDetailsComponent,
    Err404Component,
    SignupComponent,
    SigninComponent,
    AdminPanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,


    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,


    FormsModule,
    ReactiveFormsModule,


    FirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    AuthModule,
    AuthGuardModule,
    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFirestoreModule,
    // AngularFireStorageModule,
    AngularFireAuthModule


  ],
  providers: [DatePipe,
    {provide: LOCALE_ID, useValue: 'pl'},

  {provide: MAT_DATE_LOCALE, useValue: 'pl'},
  {
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
  },
  {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  {provide: FIREBASE_OPTIONS, useValue: environment.firebase},
],

  bootstrap: [AppComponent]
})
export class AppModule { }
