import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'drug',
        data: { pageTitle: 'Drugs' },
        loadChildren: () => import('./drug/drug.module').then(m => m.DrugModule),
      },
      {
        path: 'patient',
        data: { pageTitle: 'Patients' },
        loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule),
      },
      {
        path: 'doctor',
        data: { pageTitle: 'Doctors' },
        loadChildren: () => import('./doctor/doctor.module').then(m => m.DoctorModule),
      },
      {
        path: 'prescription',
        data: { pageTitle: 'Prescriptions' },
        loadChildren: () => import('./prescription/prescription.module').then(m => m.PrescriptionModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
