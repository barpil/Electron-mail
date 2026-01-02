import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMessageForm } from './new-message-form';

describe('NewMessageForm', () => {
  let component: NewMessageForm;
  let fixture: ComponentFixture<NewMessageForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewMessageForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMessageForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
