import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDrug } from '../drug.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../drug.test-samples';

import { DrugService, RestDrug } from './drug.service';

const requireRestSample: RestDrug = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  updatedDate: sampleWithRequiredData.updatedDate?.toJSON(),
};

describe('Drug Service', () => {
  let service: DrugService;
  let httpMock: HttpTestingController;
  let expectedResult: IDrug | IDrug[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DrugService);
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

    it('should create a Drug', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const drug = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(drug).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Drug', () => {
      const drug = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(drug).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Drug', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Drug', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Drug', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDrugToCollectionIfMissing', () => {
      it('should add a Drug to an empty array', () => {
        const drug: IDrug = sampleWithRequiredData;
        expectedResult = service.addDrugToCollectionIfMissing([], drug);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(drug);
      });

      it('should not add a Drug to an array that contains it', () => {
        const drug: IDrug = sampleWithRequiredData;
        const drugCollection: IDrug[] = [
          {
            ...drug,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDrugToCollectionIfMissing(drugCollection, drug);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Drug to an array that doesn't contain it", () => {
        const drug: IDrug = sampleWithRequiredData;
        const drugCollection: IDrug[] = [sampleWithPartialData];
        expectedResult = service.addDrugToCollectionIfMissing(drugCollection, drug);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(drug);
      });

      it('should add only unique Drug to an array', () => {
        const drugArray: IDrug[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const drugCollection: IDrug[] = [sampleWithRequiredData];
        expectedResult = service.addDrugToCollectionIfMissing(drugCollection, ...drugArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const drug: IDrug = sampleWithRequiredData;
        const drug2: IDrug = sampleWithPartialData;
        expectedResult = service.addDrugToCollectionIfMissing([], drug, drug2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(drug);
        expect(expectedResult).toContain(drug2);
      });

      it('should accept null and undefined values', () => {
        const drug: IDrug = sampleWithRequiredData;
        expectedResult = service.addDrugToCollectionIfMissing([], null, drug, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(drug);
      });

      it('should return initial array if no Drug is added', () => {
        const drugCollection: IDrug[] = [sampleWithRequiredData];
        expectedResult = service.addDrugToCollectionIfMissing(drugCollection, undefined, null);
        expect(expectedResult).toEqual(drugCollection);
      });
    });

    describe('compareDrug', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDrug(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDrug(entity1, entity2);
        const compareResult2 = service.compareDrug(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDrug(entity1, entity2);
        const compareResult2 = service.compareDrug(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDrug(entity1, entity2);
        const compareResult2 = service.compareDrug(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
