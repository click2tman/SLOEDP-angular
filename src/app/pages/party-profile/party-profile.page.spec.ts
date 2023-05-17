import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartyProfilePage } from './party-profile.page';

describe('PartyProfilePage', () => {
  let component: PartyProfilePage;
  let fixture: ComponentFixture<PartyProfilePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PartyProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
