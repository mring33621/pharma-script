import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPrescription } from '../prescription.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../prescription.test-samples';

import { PrescriptionService, RestPrescription } from './prescription.service';

const requireRestSample: RestPrescription = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  updatedDate: sampleWithRequiredData.updatedDate?.toJSON(),
};

describe('Prescription Service', () => {
  let service: PrescriptionService;
  let httpMock: HttpTestingController;
  let expectedResult: IPrescription | IPrescription[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PrescriptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Prescription', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const prescription = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(prescription).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Prescription', () => {
      const prescription = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(prescription).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Prescription', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Prescription', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Prescription', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPrescriptionToCollectionIfMissing', () => {
      it('should add a Prescription to an empty array', () => {
        const prescription: IPrescription = sampleWithRequiredData;
        expectedResult = service.addPrescriptionToCollectionIfMissing([], prescription);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(prescription);
      });

      it('should not add a Prescription to an array that contains it', () => {
        const prescription: IPrescription = sampleWithRequiredData;
        const prescriptionCollection: IPrescription[] = [
          {
            ...prescription,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPrescriptionToCollectionIfMissing(prescriptionCollection, prescription);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Prescription to an array that doesn't contain it", () => {
        const prescription: IPrescription = sampleWithRequiredData;
        const prescriptionCollection: IPrescription[] = [sampleWithPartialData];
        expectedResult = service.addPrescriptionToCollectionIfMissing(prescriptionCollection, prescription);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(prescription);
      });

      it('should add only unique Prescription to an array', () => {
        const prescriptionArray: IPrescription[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const prescriptionCollection: IPrescription[] = [sampleWithRequiredData];
        expectedResult = service.addPrescriptionToCollectionIfMissing(prescriptionCollection, ...prescriptionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const prescription: IPrescription = sampleWithRequiredData;
        const prescription2: IPrescription = sampleWithPartialData;
        expectedResult = service.addPrescriptionToCollectionIfMissing([], prescription, prescription2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(prescription);
        expect(expectedResult).toContain(prescription2);
      });

      it('should accept null and undefined values', () => {
        const prescription: IPrescription = sampleWithRequiredData;
        expectedResult = service.addPrescriptionToCollectionIfMissing([], null, prescription, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(prescription);
      });

      it('should return initial array if no Prescription is added', () => {
        const prescriptionCollection: IPrescription[] = [sampleWithRequiredData];
        expectedResult = service.addPrescriptionToCollectionIfMissing(prescriptionCollection, undefined, null);
        expect(expectedResult).toEqual(prescriptionCollection);
      });
    });

    describe('comparePrescription', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePrescription(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePrescription(entity1, entity2);
        const compareResult2 = service.comparePrescription(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePrescription(entity1, entity2);
        const compareResult2 = service.comparePrescription(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePrescription(entity1, entity2);
        const compareResult2 = service.comparePrescription(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
