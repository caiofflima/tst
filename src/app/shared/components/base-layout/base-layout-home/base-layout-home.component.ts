import { Component, OnInit } from '@angular/core';
import { BaseLayout } from '../base-layout';
import { Location } from '@angular/common';

@Component({
  selector: 'asc-base-layout-home',
  templateUrl: './base-layout-home.component.html',
  styleUrls: ['./base-layout-home.component.scss']
})
export class BaseLayoutHomeComponent extends BaseLayout implements OnInit {

  constructor(protected override location: Location) {
    super(location)
   }

  ngOnInit() {
  }

}
