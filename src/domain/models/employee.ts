export type EmployeeStatus = 'active' | 'inactive' | 'on_leave';
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  status: EmployeeStatus;
  createdAt: string;
  phone?: string;
  notes?: string;
}
