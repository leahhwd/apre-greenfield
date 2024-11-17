import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableComponent } from '../../../shared/table/table.component';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-feedback-by-year',
  standalone: true,
  imports: [TableComponent, ReactiveFormsModule, CommonModule],
  template: `
  <h1>Customer Feedback by Year</h1>
  <div class="year-container">
    <form class="form" [formGroup]="yearForm" (ngSubmit)="onSubmit()">

    @if (errorMessage) {
      <div class="message message--error">{{ errorMessage }} </div>
    }

      <div class="form__group">
        <label class="label" for="year">Year</label>
        <select class="select" formControlName="year" id="year" name="year">
          @for(year of years; track year) {
            <option value="{{ year.value }}">{{ year.name }}</option>
          }
        </select>
      </div>
      <div class="form__actions">
        <button class="button button--primary" type="submit">Submit</button>
      </div>
    </form>

    @if (feedbackData.length > 0) {
      <div class="card chart-card">
        <app-table
          [title]="'Customer Feedback'"
          [data]="feedbackData"
          [headers]="['Date', 'Region', 'Product', 'Category', 'Channel', 'Salesperson', 'Customer', 'Rating', 'Feedback Type', 'Sales Amount', 'Sentiment', 'Text', 'Source', 'Status']"
          [sortableColumns]="['Date']"
          [headerBackground]="'secondary'"
          >
        </app-table>
      </div>
    }
  </div>
  `,
  styles: `


  `
})
export class CustomerFeedbackByYearComponent {

  //arrays to hold data
  feedbackData: any[] = [];
  years: any[] = [];
  errorMessage: String;
  //Form control to require validation
  yearForm = this.fb.group ({
    year: [ null, Validators.compose([Validators.required])]
  });

  constructor(private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.years = this.loadYears();
    this.errorMessage = '';
  }

  //Populate the years array
  loadYears() {
    return [
      { value: 2024, name: '2024' },
      { value: 2023, name: '2023' },
      { value: 2022, name: '2022' },
      { value: 2021, name: '2021' },
      { value: 2020, name: '2020' },
      { value: 2019, name: '2019' }
    ];
  }

  //Send request to fetch data
  onSubmit() {
    //Check for validation
    if(this.yearForm.invalid) {
      this.errorMessage = 'Year Required';
      return;
    }
    //retrieve selected year
    const year = this.yearForm.controls['year'].value;
    //GET request
    this.http.get(`${environment.apiBaseUrl}/reports/customer-feedback/customer-feedback-by-year?year=${year}`).subscribe({
      next: (data: any) => {
        this.feedbackData = data;
        for(let data of this.feedbackData) {
          //Assign data to labels
          data['Date'] = new Date (data['date']).toLocaleDateString();
          data['Region'] = data['region'];
          data['Product'] = data['product'];
          data['Category'] = data['category'];
          data['Channel'] = data['channel'];
          data['Salesperson'] = data['salesperson'];
          data['Customer'] = data['customer'];
          data['Rating'] = data['rating'];
          data['Feedback Type'] = data['feedbackType'];
          data['Sales Amount'] = data['salesAmount'];
          data['Sentiment'] = data['feedbackSentiment'];
          data['Text'] = data['feedbackText'];
          data['Source'] = data['feedbackSource'];
          data['Status'] = data['feedbackStatus']
        }

        console.log('Feedback Data: ', this.feedbackData);
      },
      error: (err) => {
        console.error('Error fetching customer feedback data: ', err);
      },
    });
  }
}
