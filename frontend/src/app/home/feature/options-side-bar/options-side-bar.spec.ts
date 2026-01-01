import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsSideBar } from './options-side-bar';

describe('OptionsSideBar', () => {
  let component: OptionsSideBar;
  let fixture: ComponentFixture<OptionsSideBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsSideBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsSideBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
