import dayjs from 'dayjs/esm';

import { IPatient, NewPatient } from './patient.model';

export const sampleWithRequiredData: IPatient = {
  id: 39843,
  firstName: 'Briana',
  lastName: 'Stehr',
  birthdate: dayjs('2023-03-06'),
  createdDate: dayjs('2023-03-06T13:17'),
  updatedDate: dayjs('2023-03-06T22:57'),
};

export const sampleWithPartialData: IPatient = {
  id: 51891,
  firstName: 'Leone',
  lastName: 'Emmerich',
  birthdate: dayjs('2023-03-06'),
  createdDate: dayjs('2023-03-06T15:50'),
  updatedDate: dayjs('2023-03-06T03:47'),
};

export const sampleWithFullData: IPatient = {
  id: 7908,
  firstName: 'Zion',
  lastName: 'McClure',
  birthdate: dayjs('2023-03-06'),
  createdDate: dayjs('2023-03-06T21:22'),
  updatedDate: dayjs('2023-03-07T02:27'),
};

export const sampleWithNewData: NewPatient = {
  firstName: 'Nicole',
  lastName: 'Anderson',
  birthdate: dayjs('2023-03-06'),
  createdDate: dayjs('2023-03-06T03:19'),
  updatedDate: dayjs('2023-03-06T17:10'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
