package com.mattring.pharmascript.service.mapper;

import com.mattring.pharmascript.domain.Patient;
import com.mattring.pharmascript.service.dto.PatientDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Patient} and its DTO {@link PatientDTO}.
 */
@Mapper(componentModel = "spring")
public interface PatientMapper extends EntityMapper<PatientDTO, Patient> {}
