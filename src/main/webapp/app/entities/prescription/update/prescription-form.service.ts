import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPrescription, NewPrescription } from '../prescription.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPrescription for edit and NewPrescriptionFormGroupInput for create.
 */
type PrescriptionFormGroupInput = IPrescription | PartialWithRequiredKeyOf<NewPrescription>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPrescription | NewPrescription> = Omit<T, 'createdDate' | 'updatedDate'> & {
  createdDate?: string | null;
  updatedDate?: string | null;
};

type PrescriptionFormRawValue = FormValueOf<IPrescription>;

type NewPrescriptionFormRawValue = FormValueOf<NewPrescription>;

type PrescriptionFormDefaults = Pick<NewPrescription, 'id' | 'createdDate' | 'updatedDate'>;

type PrescriptionFormGroupContent = {
  id: FormControl<PrescriptionFormRawValue['id'] | NewPrescription['id']>;
  dosageAmount: FormControl<PrescriptionFormRawValue['dosageAmount']>;
  dosageInterval: FormControl<PrescriptionFormRawValue['dosageInterval']>;
  createdDate: FormControl<PrescriptionFormRawValue['createdDate']>;
  updatedDate: FormControl<PrescriptionFormRawValue['updatedDate']>;
  drug: FormControl<PrescriptionFormRawValue['drug']>;
  patient: FormControl<PrescriptionFormRawValue['patient']>;
  doctor: FormControl<PrescriptionFormRawValue['doctor']>;
};

export type PrescriptionFormGroup = FormGroup<PrescriptionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PrescriptionFormService {
  createPrescriptionFormGroup(prescription: PrescriptionFormGroupInput = { id: null }): PrescriptionFormGroup {
    const prescriptionRawValue = this.convertPrescriptionToPrescriptionRawValue({
      ...this.getFormDefaults(),
      ...prescription,
    });
    return new FormGroup<PrescriptionFormGroupContent>({
      id: new FormControl(
        { value: prescriptionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      dosageAmount: new FormControl(prescriptionRawValue.dosageAmount, {
        validators: [Validators.required],
      }),
      dosageInterval: new FormControl(prescriptionRawValue.dosageInterval, {
        validators: [Validators.required],
      }),
      createdDate: new FormControl(prescriptionRawValue.createdDate, {
        validators: [Validators.required],
      }),
      updatedDate: new FormControl(prescriptionRawValue.updatedDate, {
        validators: [Validators.required],
      }),
      drug: new FormControl(prescriptionRawValue.drug),
      patient: new FormControl(prescriptionRawValue.patient),
      doctor: new FormControl(prescriptionRawValue.doctor),
    });
  }

  getPrescription(form: PrescriptionFormGroup): IPrescription | NewPrescription {
    return this.convertPrescriptionRawValueToPrescription(form.getRawValue() as PrescriptionFormRawValue | NewPrescriptionFormRawValue);
  }

  resetForm(form: PrescriptionFormGroup, prescription: PrescriptionFormGroupInput): void {
    const prescriptionRawValue = this.convertPrescriptionToPrescriptionRawValue({ ...this.getFormDefaults(), ...prescription });
    form.reset(
      {
        ...prescriptionRawValue,
        id: { value: prescriptionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PrescriptionFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      updatedDate: currentTime,
    };
  }

  private convertPrescriptionRawValueToPrescription(
    rawPrescription: PrescriptionFormRawValue | NewPrescriptionFormRawValue
  ): IPrescription | NewPrescription {
    return {
      ...rawPrescription,
      createdDate: dayjs(rawPrescription.createdDate, DATE_TIME_FORMAT),
      updatedDate: dayjs(rawPrescription.updatedDate, DATE_TIME_FORMAT),
    };
  }

  private convertPrescriptionToPrescriptionRawValue(
    prescription: IPrescription | (Partial<NewPrescription> & PrescriptionFormDefaults)
  ): PrescriptionFormRawValue | PartialWithRequiredKeyOf<NewPrescriptionFormRawValue> {
    return {
      ...prescription,
      createdDate: prescription.createdDate ? prescription.createdDate.format(DATE_TIME_FORMAT) : undefined,
      updatedDate: prescription.updatedDate ? prescription.updatedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
