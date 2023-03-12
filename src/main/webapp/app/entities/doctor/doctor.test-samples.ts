import dayjs from 'dayjs/esm';

import { IDoctor, NewDoctor } from './doctor.model';

export const sampleWithRequiredData: IDoctor = {
  id: 47308,
  firstName: 'Kendall',
  lastName: 'Koch',
  licenseNumber: 'Investment reinvent Guernsey',
  createdDate: dayjs('2023-03-06T08:52'),
  updatedDate: dayjs('2023-03-07T00:17'),
};

export const sampleWithPartialData: IDoctor = {
  id: 37126,
  firstName: 'Claude',
  lastName: 'Dicki',
  licenseNumber: 'Investment',
  createdDate: dayjs('2023-03-06T21:28'),
  updatedDate: dayjs('2023-03-06T11:02'),
};

export const sampleWithFullData: IDoctor = {
  id: 19129,
  firstName: 'Ned',
  lastName: 'Grady',
  licenseNumber: 'Savings program',
  createdDate: dayjs('2023-03-07T02:38'),
  updatedDate: dayjs('2023-03-06T22:32'),
};

export const sampleWithNewData: NewDoctor = {
  firstName: 'Burnice',
  lastName: 'Osinski',
  licenseNumber: 'Dynamic',
  createdDate: dayjs('2023-03-06T07:17'),
  updatedDate: dayjs('2023-03-06T15:35'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
