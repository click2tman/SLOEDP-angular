import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CouncilorPage } from './councilor.page';

describe('CouncilorPage', () => {
  let component: CouncilorPage;
  let fixture: ComponentFixture<CouncilorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CouncilorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
