import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripTileComponent } from './trip-tile.component';

describe('TripTileComponent', () => {
  let component: TripTileComponent;
  let fixture: ComponentFixture<TripTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripTileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
