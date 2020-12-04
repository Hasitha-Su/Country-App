// http-data.servie.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Country } from '../models/country';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpDataService {


  // Spring-Boot Rest API path
  base_path = 'http://localhost:8080/rest/v2';

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The rest api returned an unsuccessful response code.
      // The response body (error message),
      console.error(
        `Backend returned code ${error.status}, ` +
        `body: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };


  // Add country
  addCountry(country): Observable<Country> {
    return this.http
      .post<Country>(this.base_path + '/country', JSON.stringify(country), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  // // Get single student data by ID
  // getItem(id): Observable<Country> {
  //   return this.http
  //     .get<Country>(this.base_path + '/' + id)
  //     .pipe(
  //       retry(2),
  //       catchError(this.handleError)
  //     )
  // }

  // Get all Countries
  getList(): Observable<Country> {
    return this.http
      .get<Country>(this.base_path + '/countries')
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  // Update country by id
  updateById(country): Observable<Country> {
    return this.http
      // .post<Country>(this.base_path + '/country' + id, JSON.stringify(country), this.httpOptions)
      .post<Country>(this.base_path + '/country', JSON.stringify(country), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  // Delete country by id
  deleteCountry(id) {
    return this.http
      .delete<Country>(this.base_path + '/country/' + id, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
}