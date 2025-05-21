import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-delete-user',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './dialog-delete-user.component.html',
  styleUrl: './dialog-delete-user.component.css'
})
export class DialogDeleteUserComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number, userName: string, onResult?: (result: boolean) => void }
  ) {}

  close(result: boolean): void {
    this.dialogRef.close(result); // תחזיר את התוצאה
    if (this.data.onResult) {
      this.data.onResult(result);
    }
  }
}
