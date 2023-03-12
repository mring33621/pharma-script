import dayjs from 'dayjs/esm';
import { IDrug } from 'app/entities/drug/drug.model';
import { IPatient } from 'app/entities/patient/patient.model';
import { IDoctor } from 'app/entities/doctor/doctor.model';

export interface IPrescription {
  id: number;
  dosageAmount?: number | null;
  dosageInterval?: number | null;
  createdDate?: dayjs.Dayjs | null;
  updatedDate?: dayjs.Dayjs | null;
  drug?: Pick<IDrug, 'id' | 'brandName' | 'genericName'> | null;
  patient?: Pick<IPatient, 'id' | 'firstName' | 'lastName'> | null;
  doctor?: Pick<IDoctor, 'id' | 'firstName' | 'lastName'> | null;
}

export type NewPrescription = Omit<IPrescription, 'id'> & { id: null };
