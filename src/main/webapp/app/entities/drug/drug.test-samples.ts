import dayjs from 'dayjs/esm';

import { IDrug, NewDrug } from './drug.model';

export const sampleWithRequiredData: IDrug = {
  id: 4801,
  maker: 'Games',
  brandName: 'Buckinghamshire',
  genericName: 'system',
  createdDate: dayjs('2023-03-07T01:11'),
  updatedDate: dayjs('2023-03-06T10:34'),
};

export const sampleWithPartialData: IDrug = {
  id: 28644,
  maker: 'optimal',
  brandName: 'connecting Savings',
  genericName: 'Cambridgeshire action-items',
  createdDate: dayjs('2023-03-06T17:16'),
  updatedDate: dayjs('2023-03-07T02:44'),
};

export const sampleWithFullData: IDrug = {
  id: 53725,
  maker: 'Communications Account Indiana',
  brandName: 'Bedfordshire Inlet Rustic',
  genericName: 'Rustic',
  createdDate: dayjs('2023-03-06T05:24'),
  updatedDate: dayjs('2023-03-06T17:47'),
};

export const sampleWithNewData: NewDrug = {
  maker: 'reintermediate Florida',
  brandName: 'Tools Frozen Ramp',
  genericName: 'Loan cross-platform',
  createdDate: dayjs('2023-03-06T18:04'),
  updatedDate: dayjs('2023-03-06T15:15'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
