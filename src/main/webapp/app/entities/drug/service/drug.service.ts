import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDrug, NewDrug } from '../drug.model';

export type PartialUpdateDrug = Partial<IDrug> & Pick<IDrug, 'id'>;

type RestOf<T extends IDrug | NewDrug> = Omit<T, 'createdDate' | 'updatedDate'> & {
  createdDate?: string | null;
  updatedDate?: string | null;
};

export type RestDrug = RestOf<IDrug>;

export type NewRestDrug = RestOf<NewDrug>;

export type PartialUpdateRestDrug = RestOf<PartialUpdateDrug>;

export type EntityResponseType = HttpResponse<IDrug>;
export type EntityArrayResponseType = HttpResponse<IDrug[]>;

@Injectable({ providedIn: 'root' })
export class DrugService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/drugs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(drug: NewDrug): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(drug);
    return this.http.post<RestDrug>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(drug: IDrug): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(drug);
    return this.http
      .put<RestDrug>(`${this.resourceUrl}/${this.getDrugIdentifier(drug)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(drug: PartialUpdateDrug): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(drug);
    return this.http
      .patch<RestDrug>(`${this.resourceUrl}/${this.getDrugIdentifier(drug)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestDrug>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDrug[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDrugIdentifier(drug: Pick<IDrug, 'id'>): number {
    return drug.id;
  }

  compareDrug(o1: Pick<IDrug, 'id'> | null, o2: Pick<IDrug, 'id'> | null): boolean {
    return o1 && o2 ? this.getDrugIdentifier(o1) === this.getDrugIdentifier(o2) : o1 === o2;
  }

  addDrugToCollectionIfMissing<Type extends Pick<IDrug, 'id'>>(
    drugCollection: Type[],
    ...drugsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const drugs: Type[] = drugsToCheck.filter(isPresent);
    if (drugs.length > 0) {
      const drugCollectionIdentifiers = drugCollection.map(drugItem => this.getDrugIdentifier(drugItem)!);
      const drugsToAdd = drugs.filter(drugItem => {
        const drugIdentifier = this.getDrugIdentifier(drugItem);
        if (drugCollectionIdentifiers.includes(drugIdentifier)) {
          return false;
        }
        drugCollectionIdentifiers.push(drugIdentifier);
        return true;
      });
      return [...drugsToAdd, ...drugCollection];
    }
    return drugCollection;
  }

  protected convertDateFromClient<T extends IDrug | NewDrug | PartialUpdateDrug>(drug: T): RestOf<T> {
    return {
      ...drug,
      createdDate: drug.createdDate?.toJSON() ?? null,
      updatedDate: drug.updatedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restDrug: RestDrug): IDrug {
    return {
      ...restDrug,
      createdDate: restDrug.createdDate ? dayjs(restDrug.createdDate) : undefined,
      updatedDate: restDrug.updatedDate ? dayjs(restDrug.updatedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDrug>): HttpResponse<IDrug> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDrug[]>): HttpResponse<IDrug[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
