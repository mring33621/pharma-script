import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PrescriptionFormService } from './prescription-form.service';
import { PrescriptionService } from '../service/prescription.service';
import { IPrescription } from '../prescription.model';
import { IDrug } from 'app/entities/drug/drug.model';
import { DrugService } from 'app/entities/drug/service/drug.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IDoctor } from 'app/entities/doctor/doctor.model';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';

import { PrescriptionUpdateComponent } from './prescription-update.component';

describe('Prescription Management Update Component', () => {
  let comp: PrescriptionUpdateComponent;
  let fixture: ComponentFixture<PrescriptionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let prescriptionFormService: PrescriptionFormService;
  let prescriptionService: PrescriptionService;
  let drugService: DrugService;
  let patientService: PatientService;
  let doctorService: DoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PrescriptionUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PrescriptionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PrescriptionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    prescriptionFormService = TestBed.inject(PrescriptionFormService);
    prescriptionService = TestBed.inject(PrescriptionService);
    drugService = TestBed.inject(DrugService);
    patientService = TestBed.inject(PatientService);
    doctorService = TestBed.inject(DoctorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Drug query and add missing value', () => {
      const prescription: IPrescription = { id: 456 };
      const drug: IDrug = { id: 80222 };
      prescription.drug = drug;

      const drugCollection: IDrug[] = [{ id: 34268 }];
      jest.spyOn(drugService, 'query').mockReturnValue(of(new HttpResponse({ body: drugCollection })));
      const additionalDrugs = [drug];
      const expectedCollection: IDrug[] = [...additionalDrugs, ...drugCollection];
      jest.spyOn(drugService, 'addDrugToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ prescription });
      comp.ngOnInit();

      expect(drugService.query).toHaveBeenCalled();
      expect(drugService.addDrugToCollectionIfMissing).toHaveBeenCalledWith(
        drugCollection,
        ...additionalDrugs.map(expect.objectContaining)
      );
      expect(comp.drugsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Patient query and add missing value', () => {
      const prescription: IPrescription = { id: 456 };
      const patient: IPatient = { id: 77199 };
      prescription.patient = patient;

      const patientCollection: IPatient[] = [{ id: 41223 }];
      jest.spyOn(patientService, 'query').mockReturnValue(of(new HttpResponse({ body: patientCollection })));
      const additionalPatients = [patient];
      const expectedCollection: IPatient[] = [...additionalPatients, ...patientCollection];
      jest.spyOn(patientService, 'addPatientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ prescription });
      comp.ngOnInit();

      expect(patientService.query).toHaveBeenCalled();
      expect(patientService.addPatientToCollectionIfMissing).toHaveBeenCalledWith(
        patientCollection,
        ...additionalPatients.map(expect.objectContaining)
      );
      expect(comp.patientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Doctor query and add missing value', () => {
      const prescription: IPrescription = { id: 456 };
      const doctor: IDoctor = { id: 61435 };
      prescription.doctor = doctor;

      const doctorCollection: IDoctor[] = [{ id: 81852 }];
      jest.spyOn(doctorService, 'query').mockReturnValue(of(new HttpResponse({ body: doctorCollection })));
      const additionalDoctors = [doctor];
      const expectedCollection: IDoctor[] = [...additionalDoctors, ...doctorCollection];
      jest.spyOn(doctorService, 'addDoctorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ prescription });
      comp.ngOnInit();

      expect(doctorService.query).toHaveBeenCalled();
      expect(doctorService.addDoctorToCollectionIfMissing).toHaveBeenCalledWith(
        doctorCollection,
        ...additionalDoctors.map(expect.objectContaining)
      );
      expect(comp.doctorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const prescription: IPrescription = { id: 456 };
      const drug: IDrug = { id: 15159 };
      prescription.drug = drug;
      const patient: IPatient = { id: 86368 };
      prescription.patient = patient;
      const doctor: IDoctor = { id: 83732 };
      prescription.doctor = doctor;

      activatedRoute.data = of({ prescription });
      comp.ngOnInit();

      expect(comp.drugsSharedCollection).toContain(drug);
      expect(comp.patientsSharedCollection).toContain(patient);
      expect(comp.doctorsSharedCollection).toContain(doctor);
      expect(comp.prescription).toEqual(prescription);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPrescription>>();
      const prescription = { id: 123 };
      jest.spyOn(prescriptionFormService, 'getPrescription').mockReturnValue(prescription);
      jest.spyOn(prescriptionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prescription });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prescription }));
      saveSubject.complete();

      // THEN
      expect(prescriptionFormService.getPrescription).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(prescriptionService.update).toHaveBeenCalledWith(expect.objectContaining(prescription));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPrescription>>();
      const prescription = { id: 123 };
      jest.spyOn(prescriptionFormService, 'getPrescription').mockReturnValue({ id: null });
      jest.spyOn(prescriptionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prescription: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prescription }));
      saveSubject.complete();

      // THEN
      expect(prescriptionFormService.getPrescription).toHaveBeenCalled();
      expect(prescriptionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPrescription>>();
      const prescription = { id: 123 };
      jest.spyOn(prescriptionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prescription });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(prescriptionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDrug', () => {
      it('Should forward to drugService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(drugService, 'compareDrug');
        comp.compareDrug(entity, entity2);
        expect(drugService.compareDrug).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePatient', () => {
      it('Should forward to patientService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(patientService, 'comparePatient');
        comp.comparePatient(entity, entity2);
        expect(patientService.comparePatient).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDoctor', () => {
      it('Should forward to doctorService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(doctorService, 'compareDoctor');
        comp.compareDoctor(entity, entity2);
        expect(doctorService.compareDoctor).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
