import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPrescription, NewPrescription } from '../prescription.model';

export type PartialUpdatePrescription = Partial<IPrescription> & Pick<IPrescription, 'id'>;

type RestOf<T extends IPrescription | NewPrescription> = Omit<T, 'createdDate' | 'updatedDate'> & {
  createdDate?: string | null;
  updatedDate?: string | null;
};

export type RestPrescription = RestOf<IPrescription>;

export type NewRestPrescription = RestOf<NewPrescription>;

export type PartialUpdateRestPrescription = RestOf<PartialUpdatePrescription>;

export type EntityResponseType = HttpResponse<IPrescription>;
export type EntityArrayResponseType = HttpResponse<IPrescription[]>;

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/prescriptions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(prescription: NewPrescription): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(prescription);
    return this.http
      .post<RestPrescription>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(prescription: IPrescription): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(prescription);
    return this.http
      .put<RestPrescription>(`${this.resourceUrl}/${this.getPrescriptionIdentifier(prescription)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(prescription: PartialUpdatePrescription): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(prescription);
    return this.http
      .patch<RestPrescription>(`${this.resourceUrl}/${this.getPrescriptionIdentifier(prescription)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPrescription>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPrescription[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPrescriptionIdentifier(prescription: Pick<IPrescription, 'id'>): number {
    return prescription.id;
  }

  comparePrescription(o1: Pick<IPrescription, 'id'> | null, o2: Pick<IPrescription, 'id'> | null): boolean {
    return o1 && o2 ? this.getPrescriptionIdentifier(o1) === this.getPrescriptionIdentifier(o2) : o1 === o2;
  }

  addPrescriptionToCollectionIfMissing<Type extends Pick<IPrescription, 'id'>>(
    prescriptionCollection: Type[],
    ...prescriptionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const prescriptions: Type[] = prescriptionsToCheck.filter(isPresent);
    if (prescriptions.length > 0) {
      const prescriptionCollectionIdentifiers = prescriptionCollection.map(
        prescriptionItem => this.getPrescriptionIdentifier(prescriptionItem)!
      );
      const prescriptionsToAdd = prescriptions.filter(prescriptionItem => {
        const prescriptionIdentifier = this.getPrescriptionIdentifier(prescriptionItem);
        if (prescriptionCollectionIdentifiers.includes(prescriptionIdentifier)) {
          return false;
        }
        prescriptionCollectionIdentifiers.push(prescriptionIdentifier);
        return true;
      });
      return [...prescriptionsToAdd, ...prescriptionCollection];
    }
    return prescriptionCollection;
  }

  protected convertDateFromClient<T extends IPrescription | NewPrescription | PartialUpdatePrescription>(prescription: T): RestOf<T> {
    return {
      ...prescription,
      createdDate: prescription.createdDate?.toJSON() ?? null,
      updatedDate: prescription.updatedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPrescription: RestPrescription): IPrescription {
    return {
      ...restPrescription,
      createdDate: restPrescription.createdDate ? dayjs(restPrescription.createdDate) : undefined,
      updatedDate: restPrescription.updatedDate ? dayjs(restPrescription.updatedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPrescription>): HttpResponse<IPrescription> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPrescription[]>): HttpResponse<IPrescription[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
