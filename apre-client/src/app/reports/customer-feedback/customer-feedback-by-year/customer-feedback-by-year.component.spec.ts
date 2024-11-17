import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomerFeedbackByYearComponent } from './customer-feedback-by-year.component';

describe('CustomerFeedbackByYearComponent', () => {
  let component: CustomerFeedbackByYearComponent;
  let fixture: ComponentFixture<CustomerFeedbackByYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFeedbackByYearComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerFeedbackByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //It should display the title
  it('should display the title "Customer Feedback by Year', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('h1');
    expect(title).toBeTruthy();
    expect(title.textContent).toContain('Customer Feedback by Year');
  });

  //Should display the error message if form is not valid
  it('should display an error message if form is submitted without year', () => {
    component.onSubmit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;

    const errorMessageElement = compiled.querySelector('.message--error');
    expect(errorMessageElement).toBeTruthy();
    expect(errorMessageElement.textContent).toContain('Year Required');
  });

   // it should initialize the yearForm with a null value
   it('should initialize the yearForm with a null value', () => {
    const yearControl = component.yearForm.controls['year'];
    expect(yearControl.value).toBeNull();
    expect(yearControl.valid).toBeFalse();
  });
});
