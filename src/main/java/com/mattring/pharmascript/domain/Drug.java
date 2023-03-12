package com.mattring.pharmascript.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Drug.
 */
@Entity
@Table(name = "drug")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Drug implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "maker", nullable = false)
    private String maker;

    @NotNull
    @Column(name = "brand_name", nullable = false)
    private String brandName;

    @NotNull
    @Column(name = "generic_name", nullable = false)
    private String genericName;

    @NotNull
    @Column(name = "created_date", nullable = false)
    private ZonedDateTime createdDate;

    @NotNull
    @Column(name = "updated_date", nullable = false)
    private ZonedDateTime updatedDate;

    @OneToMany(mappedBy = "drug")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "drug", "patient", "doctor" }, allowSetters = true)
    private Set<Prescription> prescriptions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Drug id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMaker() {
        return this.maker;
    }

    public Drug maker(String maker) {
        this.setMaker(maker);
        return this;
    }

    public void setMaker(String maker) {
        this.maker = maker;
    }

    public String getBrandName() {
        return this.brandName;
    }

    public Drug brandName(String brandName) {
        this.setBrandName(brandName);
        return this;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public String getGenericName() {
        return this.genericName;
    }

    public Drug genericName(String genericName) {
        this.setGenericName(genericName);
        return this;
    }

    public void setGenericName(String genericName) {
        this.genericName = genericName;
    }

    public ZonedDateTime getCreatedDate() {
        return this.createdDate;
    }

    public Drug createdDate(ZonedDateTime createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public ZonedDateTime getUpdatedDate() {
        return this.updatedDate;
    }

    public Drug updatedDate(ZonedDateTime updatedDate) {
        this.setUpdatedDate(updatedDate);
        return this;
    }

    public void setUpdatedDate(ZonedDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Set<Prescription> getPrescriptions() {
        return this.prescriptions;
    }

    public void setPrescriptions(Set<Prescription> prescriptions) {
        if (this.prescriptions != null) {
            this.prescriptions.forEach(i -> i.setDrug(null));
        }
        if (prescriptions != null) {
            prescriptions.forEach(i -> i.setDrug(this));
        }
        this.prescriptions = prescriptions;
    }

    public Drug prescriptions(Set<Prescription> prescriptions) {
        this.setPrescriptions(prescriptions);
        return this;
    }

    public Drug addPrescription(Prescription prescription) {
        this.prescriptions.add(prescription);
        prescription.setDrug(this);
        return this;
    }

    public Drug removePrescription(Prescription prescription) {
        this.prescriptions.remove(prescription);
        prescription.setDrug(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Drug)) {
            return false;
        }
        return id != null && id.equals(((Drug) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Drug{" +
            "id=" + getId() +
            ", maker='" + getMaker() + "'" +
            ", brandName='" + getBrandName() + "'" +
            ", genericName='" + getGenericName() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", updatedDate='" + getUpdatedDate() + "'" +
            "}";
    }
}
