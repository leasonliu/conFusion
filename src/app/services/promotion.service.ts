import { Injectable } from "@angular/core";

import { Promotion } from "../shared/promotion";
import { Http, Response } from "@angular/http";

import { Observable } from "rxjs/Observable";
import { BaseURL } from "../shared/baseurl";
import { ProcessHttpmsgService } from "./process-httpmsg.service";

import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Injectable()
export class PromotionService {
  constructor(
    private http: Http,
    private processHTTPMsgService: ProcessHttpmsgService
  ) {}

  getPromotions(): Observable<Promotion[]> {
    // return Observable.of(PROMOTIONS).delay(2000);
    return this.http
      .get(BaseURL + "promotions")
      .map(res => {
        return this.processHTTPMsgService.extractData(res);
      })
      .catch(error => {
        return this.processHTTPMsgService.handleError(error);
      });
  }

  getPromotion(id: number): Observable<Promotion> {
    // return Observable.of(PROMOTIONS.filter(promo => promo.id === id)[0]).delay(2000);
    return this.http
      .get(BaseURL + "promotions/" + id)
      .map(res => {
        return this.processHTTPMsgService.extractData(res);
      })
      .catch(error => {
        return this.processHTTPMsgService.handleError(error);
      });
  }

  getFeaturedPromotion(): Observable<Promotion> {
    // return Observable.of(PROMOTIONS.filter(promo => promo.featured)[0]).delay(2000);
    return this.http
      .get(BaseURL + "promotions?featured=true")
      .map(res => {
        return this.processHTTPMsgService.extractData(res)[0];
      })
      .catch(error => {
        return this.processHTTPMsgService.handleError(error);
      });
  }
}
