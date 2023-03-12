package com.mattring.pharmascript.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DrugMapperTest {

    private DrugMapper drugMapper;

    @BeforeEach
    public void setUp() {
        drugMapper = new DrugMapperImpl();
    }
}
