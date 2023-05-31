import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParliamentaryPage } from './parliamentary.page';

describe('ParliamentaryPage', () => {
  let component: ParliamentaryPage;
  let fixture: ComponentFixture<ParliamentaryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ParliamentaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
