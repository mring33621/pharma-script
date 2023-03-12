import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDrug, NewDrug } from '../drug.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDrug for edit and NewDrugFormGroupInput for create.
 */
type DrugFormGroupInput = IDrug | PartialWithRequiredKeyOf<NewDrug>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDrug | NewDrug> = Omit<T, 'createdDate' | 'updatedDate'> & {
  createdDate?: string | null;
  updatedDate?: string | null;
};

type DrugFormRawValue = FormValueOf<IDrug>;

type NewDrugFormRawValue = FormValueOf<NewDrug>;

type DrugFormDefaults = Pick<NewDrug, 'id' | 'createdDate' | 'updatedDate'>;

type DrugFormGroupContent = {
  id: FormControl<DrugFormRawValue['id'] | NewDrug['id']>;
  maker: FormControl<DrugFormRawValue['maker']>;
  brandName: FormControl<DrugFormRawValue['brandName']>;
  genericName: FormControl<DrugFormRawValue['genericName']>;
  createdDate: FormControl<DrugFormRawValue['createdDate']>;
  updatedDate: FormControl<DrugFormRawValue['updatedDate']>;
};

export type DrugFormGroup = FormGroup<DrugFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DrugFormService {
  createDrugFormGroup(drug: DrugFormGroupInput = { id: null }): DrugFormGroup {
    const drugRawValue = this.convertDrugToDrugRawValue({
      ...this.getFormDefaults(),
      ...drug,
    });
    return new FormGroup<DrugFormGroupContent>({
      id: new FormControl(
        { value: drugRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      maker: new FormControl(drugRawValue.maker, {
        validators: [Validators.required],
      }),
      brandName: new FormControl(drugRawValue.brandName, {
        validators: [Validators.required],
      }),
      genericName: new FormControl(drugRawValue.genericName, {
        validators: [Validators.required],
      }),
      createdDate: new FormControl(drugRawValue.createdDate, {
        validators: [Validators.required],
      }),
      updatedDate: new FormControl(drugRawValue.updatedDate, {
        validators: [Validators.required],
      }),
    });
  }

  getDrug(form: DrugFormGroup): IDrug | NewDrug {
    return this.convertDrugRawValueToDrug(form.getRawValue() as DrugFormRawValue | NewDrugFormRawValue);
  }

  resetForm(form: DrugFormGroup, drug: DrugFormGroupInput): void {
    const drugRawValue = this.convertDrugToDrugRawValue({ ...this.getFormDefaults(), ...drug });
    form.reset(
      {
        ...drugRawValue,
        id: { value: drugRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DrugFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      updatedDate: currentTime,
    };
  }

  private convertDrugRawValueToDrug(rawDrug: DrugFormRawValue | NewDrugFormRawValue): IDrug | NewDrug {
    return {
      ...rawDrug,
      createdDate: dayjs(rawDrug.createdDate, DATE_TIME_FORMAT),
      updatedDate: dayjs(rawDrug.updatedDate, DATE_TIME_FORMAT),
    };
  }

  private convertDrugToDrugRawValue(
    drug: IDrug | (Partial<NewDrug> & DrugFormDefaults)
  ): DrugFormRawValue | PartialWithRequiredKeyOf<NewDrugFormRawValue> {
    return {
      ...drug,
      createdDate: drug.createdDate ? drug.createdDate.format(DATE_TIME_FORMAT) : undefined,
      updatedDate: drug.updatedDate ? drug.updatedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
