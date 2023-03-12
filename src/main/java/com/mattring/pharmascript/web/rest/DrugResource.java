package com.mattring.pharmascript.web.rest;

import com.mattring.pharmascript.repository.DrugRepository;
import com.mattring.pharmascript.service.DrugService;
import com.mattring.pharmascript.service.dto.DrugDTO;
import com.mattring.pharmascript.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mattring.pharmascript.domain.Drug}.
 */
@RestController
@RequestMapping("/api")
public class DrugResource {

    private final Logger log = LoggerFactory.getLogger(DrugResource.class);

    private static final String ENTITY_NAME = "drug";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DrugService drugService;

    private final DrugRepository drugRepository;

    public DrugResource(DrugService drugService, DrugRepository drugRepository) {
        this.drugService = drugService;
        this.drugRepository = drugRepository;
    }

    /**
     * {@code POST  /drugs} : Create a new drug.
     *
     * @param drugDTO the drugDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new drugDTO, or with status {@code 400 (Bad Request)} if the drug has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/drugs")
    public ResponseEntity<DrugDTO> createDrug(@Valid @RequestBody DrugDTO drugDTO) throws URISyntaxException {
        log.debug("REST request to save Drug : {}", drugDTO);
        if (drugDTO.getId() != null) {
            throw new BadRequestAlertException("A new drug cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DrugDTO result = drugService.save(drugDTO);
        return ResponseEntity
            .created(new URI("/api/drugs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /drugs/:id} : Updates an existing drug.
     *
     * @param id the id of the drugDTO to save.
     * @param drugDTO the drugDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated drugDTO,
     * or with status {@code 400 (Bad Request)} if the drugDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the drugDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/drugs/{id}")
    public ResponseEntity<DrugDTO> updateDrug(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DrugDTO drugDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Drug : {}, {}", id, drugDTO);
        if (drugDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, drugDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!drugRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DrugDTO result = drugService.update(drugDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, drugDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /drugs/:id} : Partial updates given fields of an existing drug, field will ignore if it is null
     *
     * @param id the id of the drugDTO to save.
     * @param drugDTO the drugDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated drugDTO,
     * or with status {@code 400 (Bad Request)} if the drugDTO is not valid,
     * or with status {@code 404 (Not Found)} if the drugDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the drugDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/drugs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DrugDTO> partialUpdateDrug(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DrugDTO drugDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Drug partially : {}, {}", id, drugDTO);
        if (drugDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, drugDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!drugRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DrugDTO> result = drugService.partialUpdate(drugDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, drugDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /drugs} : get all the drugs.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of drugs in body.
     */
    @GetMapping("/drugs")
    public ResponseEntity<List<DrugDTO>> getAllDrugs(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Drugs");
        Page<DrugDTO> page = drugService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /drugs/:id} : get the "id" drug.
     *
     * @param id the id of the drugDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the drugDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/drugs/{id}")
    public ResponseEntity<DrugDTO> getDrug(@PathVariable Long id) {
        log.debug("REST request to get Drug : {}", id);
        Optional<DrugDTO> drugDTO = drugService.findOne(id);
        return ResponseUtil.wrapOrNotFound(drugDTO);
    }

    /**
     * {@code DELETE  /drugs/:id} : delete the "id" drug.
     *
     * @param id the id of the drugDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/drugs/{id}")
    public ResponseEntity<Void> deleteDrug(@PathVariable Long id) {
        log.debug("REST request to delete Drug : {}", id);
        drugService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
