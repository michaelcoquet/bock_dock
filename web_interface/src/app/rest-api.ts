import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, Subscriber, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Keg } from '../types/Keg';

@Injectable({
    providedIn: 'root'
  })
export class RestApiService {

  // Define API
  apiURL = 'https://lkjwm23jm6.execute-api.us-east-1.amazonaws.com/development';

  constructor(private http: HttpClient) { }

  /*========================================
    CRUD Methods for consuming RESTful API
  =========================================*/

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    })
  }  

  // HttpClient API get() method => Fetch Kegs list
  getKegs(): Observable<Keg[]> {
    return this.http.get<Keg[]>(this.apiURL + '/keg-slots/')
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API get() method => Fetch Keg
  getKeg(id): Observable<Keg> {
    return this.http.get<Keg>(this.apiURL + '/keg-slots/' + id)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  

  // HttpClient API post() method => Create Keg
  createKeg(Keg): Observable<Keg> {
    return this.http.post<Keg>(this.apiURL + '/keg-slots', JSON.stringify(Keg), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  

  codifyKeg(Keg):any {
    var out_json = {
      "active": String(Keg.active),
      "brew_description": String(Keg.brew_description),
      "brew_name": String(Keg.brew_name),
      "createdAt": String(Keg.createdAt),
      "current_level": String(Keg.current_level),
      "finish_date": String(Keg.finish_date),
      "id": String(Keg.id),
      "kegging_date": String(Keg.kegging_date),
      "mashing_date": String(Keg.mashing_date),
      "slot_id": String(Keg.slot_id),
      "updatedAt": String(Keg.updatedAt),
    }
    return out_json;
  }

  updateCurrent(slot_id, Keg): any {
    var update_command = {
      "key_sid": String(slot_id),
      "item": this.codifyKeg(Keg),
    }
    var id_fuk:Keg;
    var payload="1"
    var temp = JSON.stringify(update_command);
    var response = this.http.post(this.apiURL + '/update-current', payload, this.httpOptions);
    response.subscribe((data: Keg) => id_fuk = data);
    console.log(id_fuk);
    return response
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API put() method => Update Keg
  updateKeg(id, Keg): Observable<Keg> {
    return this.http.put<Keg>(this.apiURL + '/keg-slots/' + id, JSON.stringify(Keg), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API delete() method => Delete Keg
  deleteKeg(id){
    return this.http.post<Keg>(this.apiURL + '/keg-slots/delete/', JSON.stringify(id), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // Error handling 
  handleError(error) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     window.alert(errorMessage);
     return throwError(errorMessage);
  }

}