import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpiderService {

  constructor(private http: HttpClient) { }

  getSpiders(){
    return this.http.get(environment.apiUrl + '/spider')
    .pipe(map(res => {
      return res;
    }));
  }

  postSpider(data){
    return this.http.post(environment.apiUrl + '/spider', data, {responseType: 'text'})
    .pipe(map(res => {
      return res;
    }));
  }

  editSpider(data){
    return this.http.post(environment.apiUrl + '/spider/edit', data, {responseType: 'text'})
    .pipe(map(res => {
      return res;
    }));
  }

  deleteSpider(name){
    return this.http.delete(environment.apiUrl + '/spider', {params: {name:name}, responseType: 'text'} )
    .pipe(map(res => {
      return res;
    }));
  }

  addPipelinesToSpider(data) {
    return this.http.post(environment.apiUrl + '/spider/pipelines', data, {responseType: 'text'})
    .pipe(map(res => {
      return res;
    }));
  }

  startTest(spider){
    return this.http.post(environment.apiUrl + '/test-crawl', spider, {responseType: 'text'})
    .pipe(map(res => {
      return res;
    }));
  }

  startCrawl(spider){
    return this.http.post(environment.apiUrl + '/test-crawl', spider, {responseType: 'text'})
    .pipe(map(res => {
      return res;
    }));
  }

  stopCrawl(){
    return this.http.get(environment.apiUrl + '/stop-crawl')
    .pipe(map(res => {
      return res;
    }));
  }

}
