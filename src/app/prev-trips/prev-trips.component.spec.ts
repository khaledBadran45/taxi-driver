import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevTripsComponent } from './prev-trips.component';

describe('PrevTripsComponent', () => {
  let component: PrevTripsComponent;
  let fixture: ComponentFixture<PrevTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrevTripsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrevTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
