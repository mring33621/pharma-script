import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDoctor, NewDoctor } from '../doctor.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDoctor for edit and NewDoctorFormGroupInput for create.
 */
type DoctorFormGroupInput = IDoctor | PartialWithRequiredKeyOf<NewDoctor>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDoctor | NewDoctor> = Omit<T, 'createdDate' | 'updatedDate'> & {
  createdDate?: string | null;
  updatedDate?: string | null;
};

type DoctorFormRawValue = FormValueOf<IDoctor>;

type NewDoctorFormRawValue = FormValueOf<NewDoctor>;

type DoctorFormDefaults = Pick<NewDoctor, 'id' | 'createdDate' | 'updatedDate'>;

type DoctorFormGroupContent = {
  id: FormControl<DoctorFormRawValue['id'] | NewDoctor['id']>;
  firstName: FormControl<DoctorFormRawValue['firstName']>;
  lastName: FormControl<DoctorFormRawValue['lastName']>;
  licenseNumber: FormControl<DoctorFormRawValue['licenseNumber']>;
  createdDate: FormControl<DoctorFormRawValue['createdDate']>;
  updatedDate: FormControl<DoctorFormRawValue['updatedDate']>;
};

export type DoctorFormGroup = FormGroup<DoctorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DoctorFormService {
  createDoctorFormGroup(doctor: DoctorFormGroupInput = { id: null }): DoctorFormGroup {
    const doctorRawValue = this.convertDoctorToDoctorRawValue({
      ...this.getFormDefaults(),
      ...doctor,
    });
    return new FormGroup<DoctorFormGroupContent>({
      id: new FormControl(
        { value: doctorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(doctorRawValue.firstName, {
        validators: [Validators.required],
      }),
      lastName: new FormControl(doctorRawValue.lastName, {
        validators: [Validators.required],
      }),
      licenseNumber: new FormControl(doctorRawValue.licenseNumber, {
        validators: [Validators.required],
      }),
      createdDate: new FormControl(doctorRawValue.createdDate, {
        validators: [Validators.required],
      }),
      updatedDate: new FormControl(doctorRawValue.updatedDate, {
        validators: [Validators.required],
      }),
    });
  }

  getDoctor(form: DoctorFormGroup): IDoctor | NewDoctor {
    return this.convertDoctorRawValueToDoctor(form.getRawValue() as DoctorFormRawValue | NewDoctorFormRawValue);
  }

  resetForm(form: DoctorFormGroup, doctor: DoctorFormGroupInput): void {
    const doctorRawValue = this.convertDoctorToDoctorRawValue({ ...this.getFormDefaults(), ...doctor });
    form.reset(
      {
        ...doctorRawValue,
        id: { value: doctorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DoctorFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      updatedDate: currentTime,
    };
  }

  private convertDoctorRawValueToDoctor(rawDoctor: DoctorFormRawValue | NewDoctorFormRawValue): IDoctor | NewDoctor {
    return {
      ...rawDoctor,
      createdDate: dayjs(rawDoctor.createdDate, DATE_TIME_FORMAT),
      updatedDate: dayjs(rawDoctor.updatedDate, DATE_TIME_FORMAT),
    };
  }

  private convertDoctorToDoctorRawValue(
    doctor: IDoctor | (Partial<NewDoctor> & DoctorFormDefaults)
  ): DoctorFormRawValue | PartialWithRequiredKeyOf<NewDoctorFormRawValue> {
    return {
      ...doctor,
      createdDate: doctor.createdDate ? doctor.createdDate.format(DATE_TIME_FORMAT) : undefined,
      updatedDate: doctor.updatedDate ? doctor.updatedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
