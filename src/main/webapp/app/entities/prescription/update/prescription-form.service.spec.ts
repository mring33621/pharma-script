import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../prescription.test-samples';

import { PrescriptionFormService } from './prescription-form.service';

describe('Prescription Form Service', () => {
  let service: PrescriptionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrescriptionFormService);
  });

  describe('Service methods', () => {
    describe('createPrescriptionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPrescriptionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dosageAmount: expect.any(Object),
            dosageInterval: expect.any(Object),
            createdDate: expect.any(Object),
            updatedDate: expect.any(Object),
            drug: expect.any(Object),
            patient: expect.any(Object),
            doctor: expect.any(Object),
          })
        );
      });

      it('passing IPrescription should create a new form with FormGroup', () => {
        const formGroup = service.createPrescriptionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dosageAmount: expect.any(Object),
            dosageInterval: expect.any(Object),
            createdDate: expect.any(Object),
            updatedDate: expect.any(Object),
            drug: expect.any(Object),
            patient: expect.any(Object),
            doctor: expect.any(Object),
          })
        );
      });
    });

    describe('getPrescription', () => {
      it('should return NewPrescription for default Prescription initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPrescriptionFormGroup(sampleWithNewData);

        const prescription = service.getPrescription(formGroup) as any;

        expect(prescription).toMatchObject(sampleWithNewData);
      });

      it('should return NewPrescription for empty Prescription initial value', () => {
        const formGroup = service.createPrescriptionFormGroup();

        const prescription = service.getPrescription(formGroup) as any;

        expect(prescription).toMatchObject({});
      });

      it('should return IPrescription', () => {
        const formGroup = service.createPrescriptionFormGroup(sampleWithRequiredData);

        const prescription = service.getPrescription(formGroup) as any;

        expect(prescription).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPrescription should not enable id FormControl', () => {
        const formGroup = service.createPrescriptionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPrescription should disable id FormControl', () => {
        const formGroup = service.createPrescriptionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
