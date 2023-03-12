import dayjs from 'dayjs/esm';

export interface IDoctor {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  licenseNumber?: string | null;
  createdDate?: dayjs.Dayjs | null;
  updatedDate?: dayjs.Dayjs | null;
}

export type NewDoctor = Omit<IDoctor, 'id'> & { id: null };
