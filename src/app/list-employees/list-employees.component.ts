import { EmployeeService } from '@service/employeeservice';

import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Employee } from '@domain/models/employee';
import { ImportsModule } from '../imports';
import { commonService } from '@service/commonservice';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [ImportsModule],
    providers:[EmployeeService,commonService],
  templateUrl: './list-employees.component.html',

})
export class ListEmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filtered: Employee[] = [];
  displayedColumns = ['name', 'email', 'department', 'status', 'actions'];

  search = new FormControl('');
  departmentFilter = new FormControl('all');
  sortBy: { key: string; dir: 'asc'|'desc' } = { key: 'firstName', dir: 'asc' };
  dialogVisible = false;

  page = 0;
  pageSize = 10;

  constructor(private empSrv: EmployeeService,
    private csv:commonService
  ) {}

  ngOnInit() {
   
    const ui = this.csv.loadUIState();
    if (ui) {
      this.page = ui.page ?? this.page;
      this.pageSize = ui.pageSize ?? this.pageSize;
      this.sortBy = ui.sortBy ?? this.sortBy;
      this.departmentFilter.setValue(ui.department ?? 'all');
      this.search.setValue(ui.search ?? '');
    }

    this.empSrv.getAll().subscribe(list => {
      this.employees = list;
      this.applyAll();
    });

    this.search.valueChanges.pipe(debounceTime(250)).subscribe(() => {
      this.applyAll();
    });
    this.departmentFilter.valueChanges.subscribe(() => this.applyAll());
  }

  applyAll() {
    let arr = [...this.employees];

    const q = (this.search.value || '').toLowerCase().trim();
    if (q) {
      arr = arr.filter(e => (`${e.firstName} ${e.lastName}`).toLowerCase().includes(q));
    }

    const dept = this.departmentFilter.value;
    if (dept && dept !== 'all') {
      arr = arr.filter(e => e.department === dept);
    }

    arr.sort((a,b) => {
      const vA = (a as any)[this.sortBy.key] ?? '';
      const vB = (b as any)[this.sortBy.key] ?? '';
      if (vA < vB) return this.sortBy.dir === 'asc' ? -1 : 1;
      if (vA > vB) return this.sortBy.dir === 'asc' ? 1 : -1;
      return 0;
    });
    this.filtered = arr;

    this.csv.saveUIState({
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      department: this.departmentFilter.value,
      search: this.search.value
    });
  }

  changeSort(key: string) {
    if (this.sortBy.key === key) {
      this.sortBy.dir = this.sortBy.dir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy.key = key;
      this.sortBy.dir = 'asc';
    }
    this.applyAll();
  }

  onDelete(id: string) {
    if (confirm('Confirm delete?')) {
      this.empSrv.remove(id);
    
    }
  }
}

