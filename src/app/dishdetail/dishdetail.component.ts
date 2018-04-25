import { Component, OnInit, Inject } from "@angular/core";

import { Params, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

import { Dish } from "../shared/dish";
import { Comment } from "../shared/comment";
import { DishService } from "../services/dish.service";

import "rxjs/add/operator/switchMap";
import { MAT_SELECTION_LIST_VALUE_ACCESSOR } from "@angular/material";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import { animation } from "@angular/core/src/animation/dsl";

@Component({
  selector: "app-dishdetail",
  templateUrl: "./dishdetail.component.html",
  styleUrls: ["./dishdetail.component.scss"],
  animations: [
    trigger("visibility", [
      state(
        "shown",
        style({
          transform: "scale(1.0)",
          opacity: 1
        })
      ),
      state(
        "hidden",
        style({
          transform: "scale(0.5)",
          opacity: 0
        })
      ),
      transition("* => *", animate("0.5s ease-in-out"))
    ])
  ]
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishcopy = null;
  dishIDs: number[];
  prev: number;
  next: number;
  comment: Comment;
  errMess: string;
  visibility = "shown";

  formErrors = {
    author: "",
    comment: ""
  };

  validationMessages = {
    author: {
      required: "Author Name is required.",
      minlength: "Author Name must be at least 2 characters."
    },
    comment: {
      required: "Comment is required."
    }
  };

  commentForm: FormGroup;

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject("BaseURL") public BaseURL
  ) {}

  ngOnInit() {
    this.createForm();

    this.dishService
      .getDishIds()
      .subscribe(dishIDs => (this.dishIDs = dishIDs));
    this.route.params
      .switchMap((params: Params) => {
        this.visibility = "hidden";
        return this.dishService.getDish(+params["id"]);
      })
      .subscribe(dish => {
        this.dish = dish;
        this.dishcopy = dish;
        this.setPrevNext(dish.id);
        this.visibility = "shown";
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

  createForm() {
    this.commentForm = this.fb.group({
      author: ["", [Validators.required, Validators.minLength(2)]],
      rating: 5,
      comment: ["", [Validators.required]]
    });

    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishcopy.save().subscribe(dish => (this.dish = dish));
    this.commentForm.reset({
      author: "",
      rating: 5,
      comment: ""
    });
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) {
      return;
    }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = "";
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + " ";
        }
      }
    }
  }
}
