import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordStrengthChecker } from './password-strength-checker';

describe('PasswordStrengthChecker', () => {
  let component: PasswordStrengthChecker;
  let fixture: ComponentFixture<PasswordStrengthChecker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordStrengthChecker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordStrengthChecker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
