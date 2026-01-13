import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfaForm } from './tfa-form';

describe('TfaForm', () => {
  let component: TfaForm;
  let fixture: ComponentFixture<TfaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TfaForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TfaForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
