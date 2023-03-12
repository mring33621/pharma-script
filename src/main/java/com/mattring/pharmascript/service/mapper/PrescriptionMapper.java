package com.mattring.pharmascript.service.mapper;

import com.mattring.pharmascript.domain.Doctor;
import com.mattring.pharmascript.domain.Drug;
import com.mattring.pharmascript.domain.Patient;
import com.mattring.pharmascript.domain.Prescription;
import com.mattring.pharmascript.service.dto.DoctorDTO;
import com.mattring.pharmascript.service.dto.DrugDTO;
import com.mattring.pharmascript.service.dto.PatientDTO;
import com.mattring.pharmascript.service.dto.PrescriptionDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Prescription} and its DTO {@link PrescriptionDTO}.
 */
@Mapper(componentModel = "spring")
public interface PrescriptionMapper extends EntityMapper<PrescriptionDTO, Prescription> {
    @Mapping(target = "drug", source = "drug", qualifiedByName = "drugId")
    @Mapping(target = "patient", source = "patient", qualifiedByName = "patientId")
    @Mapping(target = "doctor", source = "doctor", qualifiedByName = "doctorId")
    PrescriptionDTO toDto(Prescription s);

    @Named("drugId")
    DrugDTO toDtoDrugId(Drug drug);

    @Named("patientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "lastName", source = "lastName")
    PatientDTO toDtoPatientId(Patient patient);

    @Named("doctorId")
    DoctorDTO toDtoDoctorId(Doctor doctor);
}
