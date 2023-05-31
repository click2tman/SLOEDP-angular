import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChairpersonPage } from './chairperson.page';

describe('ChairpersonPage', () => {
  let component: ChairpersonPage;
  let fixture: ComponentFixture<ChairpersonPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChairpersonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
