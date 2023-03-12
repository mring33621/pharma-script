package com.mattring.pharmascript.service.mapper;

import com.mattring.pharmascript.domain.Doctor;
import com.mattring.pharmascript.service.dto.DoctorDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Doctor} and its DTO {@link DoctorDTO}.
 */
@Mapper(componentModel = "spring")
public interface DoctorMapper extends EntityMapper<DoctorDTO, Doctor> {}
