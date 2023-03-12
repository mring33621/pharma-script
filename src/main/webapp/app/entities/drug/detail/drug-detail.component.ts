import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDrug } from '../drug.model';

@Component({
  selector: 'jhi-drug-detail',
  templateUrl: './drug-detail.component.html',
})
export class DrugDetailComponent implements OnInit {
  drug: IDrug | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ drug }) => {
      this.drug = drug;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
