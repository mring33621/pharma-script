import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PrescriptionDetailComponent } from './prescription-detail.component';

describe('Prescription Management Detail Component', () => {
  let comp: PrescriptionDetailComponent;
  let fixture: ComponentFixture<PrescriptionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ prescription: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PrescriptionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PrescriptionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load prescription on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.prescription).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
