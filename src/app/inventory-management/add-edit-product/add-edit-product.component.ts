import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImportsModule } from 'src/app/imports';
import { productService } from '@service/productservice';

@Component({
  selector: 'app-add-edit-product',
  standalone: true,
  imports: [ImportsModule],
  providers:[productService],
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
export class AddEditProductComponent implements OnInit {
  categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Furniture' },
    { id: 3, name: 'Children Toys' },
    { id: 4, name: 'Office Tools' }
  ];

  form!: FormGroup;
  itemId: number=0;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private productSrv: productService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      price: [0, Validators.min(1)],
      quantity: [0, Validators.min(0)],
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
      this.productSrv.update(value.id, value);
    } else {
      const toSave = {
        name: value.name,
        price: value.price,
        quantity: value.quantity,
        categoryId: value.categoryId
      };
      console.log(toSave);
      this.productSrv.add(toSave);
    }

    this.ref.close(true);
  }
}
