import dayjs from 'dayjs/esm';

import { IPrescription, NewPrescription } from './prescription.model';

export const sampleWithRequiredData: IPrescription = {
  id: 33612,
  dosageAmount: 79691,
  dosageInterval: 47803,
  createdDate: dayjs('2023-03-06T12:23'),
  updatedDate: dayjs('2023-03-06T11:37'),
};

export const sampleWithPartialData: IPrescription = {
  id: 18023,
  dosageAmount: 69008,
  dosageInterval: 49499,
  createdDate: dayjs('2023-03-06T16:17'),
  updatedDate: dayjs('2023-03-06T09:23'),
};

export const sampleWithFullData: IPrescription = {
  id: 45004,
  dosageAmount: 13584,
  dosageInterval: 58875,
  createdDate: dayjs('2023-03-07T01:43'),
  updatedDate: dayjs('2023-03-06T13:35'),
};

export const sampleWithNewData: NewPrescription = {
  dosageAmount: 61859,
  dosageInterval: 82258,
  createdDate: dayjs('2023-03-06T09:23'),
  updatedDate: dayjs('2023-03-06T10:57'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
