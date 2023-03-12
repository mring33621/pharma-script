package com.mattring.pharmascript.service.mapper;

import com.mattring.pharmascript.domain.Drug;
import com.mattring.pharmascript.service.dto.DrugDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Drug} and its DTO {@link DrugDTO}.
 */
@Mapper(componentModel = "spring")
public interface DrugMapper extends EntityMapper<DrugDTO, Drug> {}
