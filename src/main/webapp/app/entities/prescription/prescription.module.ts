import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PrescriptionComponent } from './list/prescription.component';
import { PrescriptionDetailComponent } from './detail/prescription-detail.component';
import { PrescriptionUpdateComponent } from './update/prescription-update.component';
import { PrescriptionDeleteDialogComponent } from './delete/prescription-delete-dialog.component';
import { PrescriptionRoutingModule } from './route/prescription-routing.module';

@NgModule({
  imports: [SharedModule, PrescriptionRoutingModule],
  declarations: [PrescriptionComponent, PrescriptionDetailComponent, PrescriptionUpdateComponent, PrescriptionDeleteDialogComponent],
})
export class PrescriptionModule {}
