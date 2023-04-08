import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Constant} from '../../../../common/const/constant';

@Component({
  selector: 'app-permission-dialog',
  templateUrl: './permission-dialog.component.html',
})
export class PermissionDialogComponent {
  public title = Constant.Title.permission;
  public detail = Constant.Text.permissionDetail;
  public close = Constant.Text.close;

  constructor(public dialogRef: MatDialogRef<PermissionDialogComponent>) {
  }

  onClickClose(): void {
    this.dialogRef.close();
    window.parent.postMessage({type: Constant.typeShutdown}, '*');
  }
}
