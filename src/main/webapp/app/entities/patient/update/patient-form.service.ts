import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPatient, NewPatient } from '../patient.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPatient for edit and NewPatientFormGroupInput for create.
 */
type PatientFormGroupInput = IPatient | PartialWithRequiredKeyOf<NewPatient>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPatient | NewPatient> = Omit<T, 'createdDate' | 'updatedDate'> & {
  createdDate?: string | null;
  updatedDate?: string | null;
};

type PatientFormRawValue = FormValueOf<IPatient>;

type NewPatientFormRawValue = FormValueOf<NewPatient>;

type PatientFormDefaults = Pick<NewPatient, 'id' | 'createdDate' | 'updatedDate'>;

type PatientFormGroupContent = {
  id: FormControl<PatientFormRawValue['id'] | NewPatient['id']>;
  firstName: FormControl<PatientFormRawValue['firstName']>;
  lastName: FormControl<PatientFormRawValue['lastName']>;
  birthdate: FormControl<PatientFormRawValue['birthdate']>;
  createdDate: FormControl<PatientFormRawValue['createdDate']>;
  updatedDate: FormControl<PatientFormRawValue['updatedDate']>;
};

export type PatientFormGroup = FormGroup<PatientFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PatientFormService {
  createPatientFormGroup(patient: PatientFormGroupInput = { id: null }): PatientFormGroup {
    const patientRawValue = this.convertPatientToPatientRawValue({
      ...this.getFormDefaults(),
      ...patient,
    });
    return new FormGroup<PatientFormGroupContent>({
      id: new FormControl(
        { value: patientRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(patientRawValue.firstName, {
        validators: [Validators.required],
      }),
      lastName: new FormControl(patientRawValue.lastName, {
        validators: [Validators.required],
      }),
      birthdate: new FormControl(patientRawValue.birthdate, {
        validators: [Validators.required],
      }),
      createdDate: new FormControl(patientRawValue.createdDate, {
        validators: [Validators.required],
      }),
      updatedDate: new FormControl(patientRawValue.updatedDate, {
        validators: [Validators.required],
      }),
    });
  }

  getPatient(form: PatientFormGroup): IPatient | NewPatient {
    return this.convertPatientRawValueToPatient(form.getRawValue() as PatientFormRawValue | NewPatientFormRawValue);
  }

  resetForm(form: PatientFormGroup, patient: PatientFormGroupInput): void {
    const patientRawValue = this.convertPatientToPatientRawValue({ ...this.getFormDefaults(), ...patient });
    form.reset(
      {
        ...patientRawValue,
        id: { value: patientRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PatientFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      updatedDate: currentTime,
    };
  }

  private convertPatientRawValueToPatient(rawPatient: PatientFormRawValue | NewPatientFormRawValue): IPatient | NewPatient {
    return {
      ...rawPatient,
      createdDate: dayjs(rawPatient.createdDate, DATE_TIME_FORMAT),
      updatedDate: dayjs(rawPatient.updatedDate, DATE_TIME_FORMAT),
    };
  }

  private convertPatientToPatientRawValue(
    patient: IPatient | (Partial<NewPatient> & PatientFormDefaults)
  ): PatientFormRawValue | PartialWithRequiredKeyOf<NewPatientFormRawValue> {
    return {
      ...patient,
      createdDate: patient.createdDate ? patient.createdDate.format(DATE_TIME_FORMAT) : undefined,
      updatedDate: patient.updatedDate ? patient.updatedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
