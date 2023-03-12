import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PrescriptionComponent } from '../list/prescription.component';
import { PrescriptionDetailComponent } from '../detail/prescription-detail.component';
import { PrescriptionUpdateComponent } from '../update/prescription-update.component';
import { PrescriptionRoutingResolveService } from './prescription-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const prescriptionRoute: Routes = [
  {
    path: '',
    component: PrescriptionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PrescriptionDetailComponent,
    resolve: {
      prescription: PrescriptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PrescriptionUpdateComponent,
    resolve: {
      prescription: PrescriptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PrescriptionUpdateComponent,
    resolve: {
      prescription: PrescriptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(prescriptionRoute)],
  exports: [RouterModule],
})
export class PrescriptionRoutingModule {}
