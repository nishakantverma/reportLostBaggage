import { Component, inject, Inject, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA,MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef,} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-report-confirmation',
  standalone: true,
  imports: [MatTableModule,MatDialogActions,MatDialogContent,MatButtonModule,MatDialogClose],
  templateUrl: './report-confirmation.component.html',
  styleUrl: './report-confirmation.component.scss'
})
export class ReportConfirmationComponent implements OnInit{
  readonly dialogRef = inject(MatDialogRef<ReportConfirmationComponent>);
  displayedColumns: string[] = ['name', 'quantity', 'price'];
  dataSource!: MatTableDataSource<any>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data.valuables.valuables);
  }

  onNoClick(){
    this.dialogRef.close()
  }
}
