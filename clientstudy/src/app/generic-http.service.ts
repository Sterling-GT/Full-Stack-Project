import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { BASE_URL } from '@app/constants';
@Injectable({
providedIn: 'root',
})
export class GenericHttpService<T> {
constructor(
private http: HttpClient,
@Inject(String) private endPoint: string
) { }
getAll(): Observable<T[]> {
return this.http
.get<T[]>(`${BASE_URL}/${this.endPoint}`)
.pipe(retry(1), catchError(this.handleError));
}
getById(id: number): Observable<T> {
const urlWithId = `${BASE_URL}/${this.endPoint}}/${id}`;
return this.http
.get<T>(urlWithId)
.pipe(retry(1), catchError(this.handleError));
}
create(data: T): Observable<T> {
return this.http
.post<T>(`${BASE_URL}/${this.endPoint}`, data)
.pipe(retry(1), catchError(this.handleError));
}
update(data: T): Observable<T> {
const urlWithId = `${BASE_URL}/${this.endPoint}`;
return this.http
.put<T>(urlWithId, data)
.pipe(retry(1), catchError(this.handleError));
}
delete(id: string): Observable<number> {
const urlWithId = `${BASE_URL}/${this.endPoint}/${id}`;
return this.http
.delete<number>(urlWithId)
.pipe(retry(1), catchError(this.handleError));
}
handleError(error: any) {
let errorMessage = error.message;
console.log(error);
console.log(errorMessage);
return throwError(() => errorMessage);
}

getSome(id: number): Observable<T[]> {
    const urlWithId = `${BASE_URL}/${this.endPoint}/${id}`;
    return this.http
        .get<T[]>(urlWithId)
        .pipe(retry(1), catchError(this.handleError));
}

}