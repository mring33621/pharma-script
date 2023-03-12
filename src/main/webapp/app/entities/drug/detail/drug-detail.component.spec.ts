import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DrugDetailComponent } from './drug-detail.component';

describe('Drug Management Detail Component', () => {
  let comp: DrugDetailComponent;
  let fixture: ComponentFixture<DrugDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DrugDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ drug: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DrugDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DrugDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load drug on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.drug).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
