import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPrescription } from '../prescription.model';

@Component({
  selector: 'jhi-prescription-detail',
  templateUrl: './prescription-detail.component.html',
})
export class PrescriptionDetailComponent implements OnInit {
  prescription: IPrescription | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prescription }) => {
      this.prescription = prescription;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
