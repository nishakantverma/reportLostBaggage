import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AsyncPipe, CurrencyPipe, NgFor } from '@angular/common';
import { map, Observable, of, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ReportConfirmationComponent } from '../report-confirmation/report-confirmation.component';

@Component({
  selector: 'app-report-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule,
    NgFor, MatDatepickerModule, MatAutocompleteModule, AsyncPipe, MatButtonModule, CurrencyPipe],
  templateUrl: './report-form.component.html',
  styleUrl: './report-form.component.scss'
})
export class ReportFormComponent {

  reportForm!: FormGroup;
  filteredOptions!: Observable<string[]>;
  filteredDestinations!: Observable<string[]>;
  options: string[] = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
  dialog = inject(MatDialog);

  /**
   *
   */
  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      date: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      baggageCount: ['', [Validators.required, Validators.min(1)]],
      valuables: fb.array([])
    });

    this.filteredOptions = this.reportForm.get('origin')?.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value))
    ) ?? of([]);

    this.filteredDestinations = this.reportForm.get('destination')?.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value))
    ) ?? of([]);

    this.addValuable();
  }

  /**
   * this method gets the vauables fromArray.
   */
  get valuables(): FormArray {
    return this.reportForm.get('valuables') as FormArray;
  }

  /**
   * this method adds valuables formArray on the UI
   */
  addValuable() {
    this.valuables.push(this.fb.group({
      name: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]]
    }))
  }

  /**
   * this method will open Dialog box and ask for users confirmation.
   */
  onSubmit() {
    const dialogRef = this.dialog.open(ReportConfirmationComponent, {data: {
      valuables: this.reportForm.value,
    }, height: '400px', width: '600px', });
  }

  /**
   *  This method return the searched source or destination
   * @param value enter source or destination to be search
   * @returns this returns matching source or destination list
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  /**
   * this method return the Total valuables cost
   */
  get totalClaimAmount(): number {
    return this.valuables.controls.reduce((total: number, control: any) => {
      const quantity = control.get('quantity').value;
      const price = control.value.price;
      return total + (quantity * price);
    }, 0);
  }
}
