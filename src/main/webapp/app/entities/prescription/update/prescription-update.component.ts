import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PrescriptionFormService, PrescriptionFormGroup } from './prescription-form.service';
import { IPrescription } from '../prescription.model';
import { PrescriptionService } from '../service/prescription.service';
import { IDrug } from 'app/entities/drug/drug.model';
import { DrugService } from 'app/entities/drug/service/drug.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IDoctor } from 'app/entities/doctor/doctor.model';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';

@Component({
  selector: 'jhi-prescription-update',
  templateUrl: './prescription-update.component.html',
})
export class PrescriptionUpdateComponent implements OnInit {
  isSaving = false;
  prescription: IPrescription | null = null;

  drugsSharedCollection: IDrug[] = [];
  patientsSharedCollection: IPatient[] = [];
  doctorsSharedCollection: IDoctor[] = [];

  editForm: PrescriptionFormGroup = this.prescriptionFormService.createPrescriptionFormGroup();

  constructor(
    protected prescriptionService: PrescriptionService,
    protected prescriptionFormService: PrescriptionFormService,
    protected drugService: DrugService,
    protected patientService: PatientService,
    protected doctorService: DoctorService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDrug = (o1: IDrug | null, o2: IDrug | null): boolean => this.drugService.compareDrug(o1, o2);

  comparePatient = (o1: IPatient | null, o2: IPatient | null): boolean => this.patientService.comparePatient(o1, o2);

  compareDoctor = (o1: IDoctor | null, o2: IDoctor | null): boolean => this.doctorService.compareDoctor(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prescription }) => {
      this.prescription = prescription;
      if (prescription) {
        this.updateForm(prescription);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const prescription = this.prescriptionFormService.getPrescription(this.editForm);
    if (prescription.id !== null) {
      this.subscribeToSaveResponse(this.prescriptionService.update(prescription));
    } else {
      this.subscribeToSaveResponse(this.prescriptionService.create(prescription));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPrescription>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(prescription: IPrescription): void {
    this.prescription = prescription;
    this.prescriptionFormService.resetForm(this.editForm, prescription);

    this.drugsSharedCollection = this.drugService.addDrugToCollectionIfMissing<IDrug>(this.drugsSharedCollection, prescription.drug);
    this.patientsSharedCollection = this.patientService.addPatientToCollectionIfMissing<IPatient>(
      this.patientsSharedCollection,
      prescription.patient
    );
    this.doctorsSharedCollection = this.doctorService.addDoctorToCollectionIfMissing<IDoctor>(
      this.doctorsSharedCollection,
      prescription.doctor
    );
  }

  protected loadRelationshipsOptions(): void {
    this.drugService
      .query()
      .pipe(map((res: HttpResponse<IDrug[]>) => res.body ?? []))
      .pipe(map((drugs: IDrug[]) => this.drugService.addDrugToCollectionIfMissing<IDrug>(drugs, this.prescription?.drug)))
      .subscribe((drugs: IDrug[]) => (this.drugsSharedCollection = drugs));

    this.patientService
      .query()
      .pipe(map((res: HttpResponse<IPatient[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatient[]) => this.patientService.addPatientToCollectionIfMissing<IPatient>(patients, this.prescription?.patient))
      )
      .subscribe((patients: IPatient[]) => (this.patientsSharedCollection = patients));

    this.doctorService
      .query()
      .pipe(map((res: HttpResponse<IDoctor[]>) => res.body ?? []))
      .pipe(map((doctors: IDoctor[]) => this.doctorService.addDoctorToCollectionIfMissing<IDoctor>(doctors, this.prescription?.doctor)))
      .subscribe((doctors: IDoctor[]) => (this.doctorsSharedCollection = doctors));
  }
}
