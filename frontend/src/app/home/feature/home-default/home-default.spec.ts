import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDefault } from './home-default';

describe('HomeDefault', () => {
  let component: HomeDefault;
  let fixture: ComponentFixture<HomeDefault>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDefault]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDefault);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
