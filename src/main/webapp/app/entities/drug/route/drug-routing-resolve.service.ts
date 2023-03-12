import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDrug } from '../drug.model';
import { DrugService } from '../service/drug.service';

@Injectable({ providedIn: 'root' })
export class DrugRoutingResolveService implements Resolve<IDrug | null> {
  constructor(protected service: DrugService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDrug | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((drug: HttpResponse<IDrug>) => {
          if (drug.body) {
            return of(drug.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
