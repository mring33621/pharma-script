import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DrugComponent } from './list/drug.component';
import { DrugDetailComponent } from './detail/drug-detail.component';
import { DrugUpdateComponent } from './update/drug-update.component';
import { DrugDeleteDialogComponent } from './delete/drug-delete-dialog.component';
import { DrugRoutingModule } from './route/drug-routing.module';

@NgModule({
  imports: [SharedModule, DrugRoutingModule],
  declarations: [DrugComponent, DrugDetailComponent, DrugUpdateComponent, DrugDeleteDialogComponent],
})
export class DrugModule {}
