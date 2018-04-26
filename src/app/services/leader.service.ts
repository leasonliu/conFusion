import { Injectable } from "@angular/core";
import { Leader } from "../shared/leader";
import { Http, Response } from "@angular/http";

import { Observable } from "rxjs/Observable";

import { BaseURL } from "../shared/baseurl";
import { ProcessHttpmsgService } from "./process-httpmsg.service";

import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Injectable()
export class LeaderService {
  constructor(
    private http: Http,
    private processHTTPMsgService: ProcessHttpmsgService
  ) {}

  getLeaders(): Observable<Leader[]> {
    // return Observable.of(LEADERS).delay(2000);
    return this.http
      .get(BaseURL + "leaders")
      .map(res => {
        return this.processHTTPMsgService.extractData(res);
      })
      .catch(error => {
        return this.processHTTPMsgService.handleError(error);
      });
  }

  getLeader(id: number): Observable<Leader> {
    // return Observable.of(LEADERS.filter(leader => leader.id === id)[0]).delay(2000);
    return this.http
      .get(BaseURL + "leaders/" + id)
      .map(res => {
        return this.processHTTPMsgService.extractData(res);
      })
      .catch(error => {
        return this.processHTTPMsgService.handleError(error);
      });
  }

  getFeaturedLeader(): Observable<Leader> {
    // return Observable.of(LEADERS.filter(l => l.featured)[0]).delay(2000);
    return this.http
      .get(BaseURL + "leaders?featured=true")
      .map(res => {
        return this.processHTTPMsgService.extractData(res)[0];
      })
      .catch(error => {
        return this.processHTTPMsgService.handleError(error);
      });
  }
}
