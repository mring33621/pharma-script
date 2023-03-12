import dayjs from 'dayjs/esm';

export interface IDrug {
  id: number;
  maker?: string | null;
  brandName?: string | null;
  genericName?: string | null;
  createdDate?: dayjs.Dayjs | null;
  updatedDate?: dayjs.Dayjs | null;
}

export type NewDrug = Omit<IDrug, 'id'> & { id: null };
