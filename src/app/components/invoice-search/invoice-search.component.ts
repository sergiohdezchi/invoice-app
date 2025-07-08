import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { SearchCriteria } from '../../models/search-criteria';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-invoice-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './invoice-search.component.html',
  styleUrls: ['./invoice-search.component.scss']
})
export class InvoiceSearchComponent {
  @Output() search = new EventEmitter<SearchCriteria>();
  
  loading: boolean = false;

  searchForm: FormGroup;

  get startDateControl() { return this.searchForm.get('startDate')!; }
  get endDateControl() { return this.searchForm.get('endDate')!; }

  constructor(private fb: FormBuilder) {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.searchForm = this.fb.group({
      startDate: [thirtyDaysAgo, Validators.required],
      endDate: [today, Validators.required]
    }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator(group: FormGroup) {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (start && end && start > end) {
      return { dateRange: true };
    }

    return null;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      this.loading = true;
      this.search.emit({
        startDate: this.formatDate(this.startDateControl.value),
        endDate: this.formatDate(this.endDateControl.value)
      });
      
      // Simulating end of loading after data is fetched
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }
  }
  
  onReset(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    this.searchForm.reset({
      startDate: thirtyDaysAgo,
      endDate: today
    });
  }
}
