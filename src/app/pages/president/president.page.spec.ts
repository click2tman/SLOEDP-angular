import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PresidentPage } from './president.page';

describe('PresidentPage', () => {
  let component: PresidentPage;
  let fixture: ComponentFixture<PresidentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PresidentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
