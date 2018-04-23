import { Component, OnInit, Inject } from "@angular/core";

import { Params, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

import { Dish } from "../shared/dish";
import { DishService } from "../services/dish.service";

import "rxjs/add/operator/switchMap";
import { MAT_SELECTION_LIST_VALUE_ACCESSOR } from "@angular/material";

@Component({
  selector: "app-dishdetail",
  templateUrl: "./dishdetail.component.html",
  styleUrls: ["./dishdetail.component.scss"]
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishIDs: number[];
  prev: number;
  next: number;
  errMess: string;

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    @Inject("BaseURL") public BaseURL
  ) {}

  ngOnInit() {
    this.dishService
      .getDishIds()
      .subscribe(dishIDs => (this.dishIDs = dishIDs));
    this.route.params
      .switchMap((params: Params) => this.dishService.getDish(+params["id"]))
      .subscribe(dish => {
        this.dish = dish;
        this.setPrevNext(dish.id);
      }, errmess => (this.errMess = <any>errmess));
  }

  setPrevNext(dishId: number) {
    let index = this.dishIDs.indexOf(dishId);
    this.prev = this.dishIDs[
      (this.dishIDs.length + index - 1) % this.dishIDs.length
    ];
    this.next = this.dishIDs[
      (this.dishIDs.length + index + 1) % this.dishIDs.length
    ];
  }

  goBack(): void {
    this.location.back();
  }
}
