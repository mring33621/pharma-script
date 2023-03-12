import dayjs from 'dayjs/esm';

export interface IPatient {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  birthdate?: dayjs.Dayjs | null;
  createdDate?: dayjs.Dayjs | null;
  updatedDate?: dayjs.Dayjs | null;
}

export type NewPatient = Omit<IPatient, 'id'> & { id: null };
