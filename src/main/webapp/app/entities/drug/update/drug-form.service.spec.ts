import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../drug.test-samples';

import { DrugFormService } from './drug-form.service';

describe('Drug Form Service', () => {
  let service: DrugFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrugFormService);
  });

  describe('Service methods', () => {
    describe('createDrugFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDrugFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            maker: expect.any(Object),
            brandName: expect.any(Object),
            genericName: expect.any(Object),
            createdDate: expect.any(Object),
            updatedDate: expect.any(Object),
          })
        );
      });

      it('passing IDrug should create a new form with FormGroup', () => {
        const formGroup = service.createDrugFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            maker: expect.any(Object),
            brandName: expect.any(Object),
            genericName: expect.any(Object),
            createdDate: expect.any(Object),
            updatedDate: expect.any(Object),
          })
        );
      });
    });

    describe('getDrug', () => {
      it('should return NewDrug for default Drug initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDrugFormGroup(sampleWithNewData);

        const drug = service.getDrug(formGroup) as any;

        expect(drug).toMatchObject(sampleWithNewData);
      });

      it('should return NewDrug for empty Drug initial value', () => {
        const formGroup = service.createDrugFormGroup();

        const drug = service.getDrug(formGroup) as any;

        expect(drug).toMatchObject({});
      });

      it('should return IDrug', () => {
        const formGroup = service.createDrugFormGroup(sampleWithRequiredData);

        const drug = service.getDrug(formGroup) as any;

        expect(drug).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDrug should not enable id FormControl', () => {
        const formGroup = service.createDrugFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDrug should disable id FormControl', () => {
        const formGroup = service.createDrugFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
