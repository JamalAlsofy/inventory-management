
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '@service/employeeservice';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImportsModule } from 'src/app/imports';

@Component({
  selector: 'app-add-edit-employee',
  standalone: true,
  imports: [ImportsModule],
  providers:[EmployeeService],
  template: `
    <div class="p-fluid">
        <div class="field">
            <label>Name</label>
            <input pInputText type="text" [formControl]="form.controls['name']"/>
        </div>

        <div class="field">
            <label>Price</label>
            <input pInputText type="number" [formControl]="form.controls['price']"/>
        </div>

        <div class="field">
            <label>Quantity</label>
            <input pInputText type="number" [formControl]="form.controls['quantity']"/>
        </div>

        <div class="field">
            <label>Category</label>
            <p-dropdown 
              [options]="categories"
              optionLabel="name"
              optionValue="id"
              [formControl]="form.controls['categoryId']"></p-dropdown>
        </div>

        <div class="flex justify-content-end gap-2 mt-3">
            <p-button label="Cancel" icon="pi pi-times" (onClick)="ref.close()"></p-button>
            <p-button label="Save" icon="pi pi-check" (onClick)="save()"></p-button>
        </div>
    </div>
  `
})
export class AddEditEmployee implements OnInit {


  form!: FormGroup;
  itemId: number=0;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private EmployeeSrv: EmployeeService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.min(1)],
      quantity: ['', Validators.min(0)],
      categoryId: [null, Validators.required]
    });
    this.itemId = this.config?.data?.id;
    if (this.config?.data?.editMode) {
      this.form.patchValue(this.config.data.item);
    }
  }

  save() {
    if (!this.form.valid) return;

    const value = this.form.value;

    if (this.itemId>0 && this.itemId!==null) {
      this.EmployeeSrv.update(value.id, value);
    } else {
      const toSave = {
        firstName: value.firstName,
        lastName: value.lastName,
        price: value.price,
        quantity: value.quantity,
        categoryId: value.categoryId
      };
      console.log(toSave);
      this.EmployeeSrv.add(toSave);
    }

    this.ref.close(true);
  }
}
