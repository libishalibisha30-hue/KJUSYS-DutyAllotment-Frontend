import { Component, OnInit } from '@angular/core';
import { SharedToastService } from '@libs/shared-auth';

export interface FacultyRecord {
  empId: string;
  facultyName: string;
  department: string;
  designation: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  selected: boolean;
}

@Component({
  selector: 'app-faculty-management',
  templateUrl: './faculty-management.component.html',
  styleUrls: ['./faculty-management.component.css']
})
export class FacultyManagementComponent implements OnInit {

  constructor(private toastService: SharedToastService) {}

  searchQuery = '';

  // Filter state
  showFilterMenu = false;
  filterDepartment = '';
  filterStatus = '';
  departmentsList = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry'];
  statusList = ['Active', 'On Leave', 'Inactive'];

  // Modal states
  showAddModal = false;
  showEditModal = false;
  showViewModal = false;

  selectedFaculty: FacultyRecord | null = null;

  // Form states
  formEmpId = '';
  formFacultyName = '';
  formDepartment = 'Computer Science';
  formDesignation = 'Professor';
  formStatus: 'Active' | 'On Leave' | 'Inactive' = 'Active';

  // Three-dot action menu row state
  openMenuId: string | null = null;

  allFaculty: FacultyRecord[] = [
    { empId: 'EMP 011', facultyName: 'Dr. John',  department: 'Computer Science', designation: 'Professor',  status: 'On Leave', selected: false },
    { empId: 'EMP 015', facultyName: 'Kevin',     department: 'Computer Science', designation: 'Professor',  status: 'On Leave', selected: false },
    { empId: 'EMP 022', facultyName: 'Mary',      department: 'Computer Science', designation: 'Professor', status: 'Active',   selected: false },
    { empId: 'EMP 023', facultyName: 'Mary',      department: 'Computer Science', designation: 'Professor', status: 'Active',   selected: false },
    { empId: 'EMP 024', facultyName: 'Mary',      department: 'Computer Science', designation: 'Professor', status: 'Active',   selected: false },
    { empId: 'EMP 025', facultyName: 'Mary',      department: 'Computer Science', designation: 'Professor', status: 'Active',   selected: false },
    { empId: 'EMP 026', facultyName: 'Mary',      department: 'Computer Science', designation: 'Professor', status: 'Active',   selected: false },
    { empId: 'EMP 027', facultyName: 'Mary',      department: 'Computer Science', designation: 'Professor', status: 'Active',   selected: false },
    { empId: 'EMP 028', facultyName: 'Mary',      department: 'Computer Science', designation: 'Professor', status: 'Active',   selected: false },
    { empId: 'EMP 029', facultyName: 'Mary',      department: 'Computer Science', designation: 'Professor', status: 'Active',   selected: false },
    { empId: 'EMP 030', facultyName: 'Dr. Alice', department: 'Mathematics',      designation: 'Associate Professor', status: 'Active',   selected: false },
    { empId: 'EMP 031', facultyName: 'Robert',    department: 'Physics',          designation: 'Assistant Professor', status: 'Active',   selected: false },
    { empId: 'EMP 032', facultyName: 'Sandra',    department: 'Chemistry',        designation: 'Professor',  status: 'On Leave', selected: false },
    { empId: 'EMP 033', facultyName: 'James',     department: 'Mathematics',      designation: 'Lecturer',   status: 'Active',   selected: false },
    { empId: 'EMP 034', facultyName: 'Patricia',  department: 'Physics',          designation: 'Professor',  status: 'Active',   selected: false },
    { empId: 'EMP 035', facultyName: 'Michael',   department: 'Computer Science', designation: 'Associate Professor', status: 'Inactive', selected: false },
    { empId: 'EMP 036', facultyName: 'Linda',     department: 'Chemistry',        designation: 'Lecturer',   status: 'Active',   selected: false },
    { empId: 'EMP 037', facultyName: 'David',     department: 'Mathematics',      designation: 'Professor',  status: 'Active',   selected: false },
    { empId: 'EMP 038', facultyName: 'Barbara',   department: 'Physics',          designation: 'Assistant Professor', status: 'On Leave', selected: false },
    { empId: 'EMP 039', facultyName: 'Richard',   department: 'Computer Science', designation: 'Lecturer',   status: 'Active',   selected: false },
    { empId: 'EMP 040', facultyName: 'Susan',     department: 'Chemistry',        designation: 'Professor',  status: 'Active',   selected: false },
    { empId: 'EMP 041', facultyName: 'Joseph',    department: 'Mathematics',      designation: 'Associate Professor', status: 'Active',   selected: false },
    { empId: 'EMP 042', facultyName: 'Jessica',   department: 'Physics',          designation: 'Lecturer',   status: 'Inactive', selected: false },
    { empId: 'EMP 043', facultyName: 'Thomas',    department: 'Computer Science', designation: 'Professor',  status: 'Active',   selected: false },
    { empId: 'EMP 044', facultyName: 'Sarah',     department: 'Chemistry',        designation: 'Assistant Professor', status: 'Active',   selected: false },
  ];

  filteredFaculty: FacultyRecord[] = [];

  // ── Pagination ──────────────────────────────────────────────────────────────
  rowsPerPage = 10;
  currentPage = 1;

  get totalItems(): number { return this.filteredFaculty.length; }
  get totalPages(): number { return Math.max(1, Math.ceil(this.totalItems / this.rowsPerPage)); }
  get rangeStart(): number { return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.rowsPerPage + 1; }
  get rangeEnd(): number   { return Math.min(this.currentPage * this.rowsPerPage, this.totalItems); }

  get pagedFaculty(): FacultyRecord[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredFaculty.slice(start, start + this.rowsPerPage);
  }

  get visiblePages(): number[] {
    const max = 5;
    let start = Math.max(1, this.currentPage - Math.floor(max / 2));
    let end   = Math.min(this.totalPages, start + max - 1);
    start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  get allSelected(): boolean {
    return this.pagedFaculty.length > 0 && this.pagedFaculty.every(f => f.selected);
  }

  ngOnInit(): void {
    this.filteredFaculty = [...this.allFaculty];
  }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredFaculty = this.allFaculty.filter(f => {
      const matchesSearch = q
        ? f.empId.toLowerCase().includes(q) ||
          f.facultyName.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q) ||
          f.designation.toLowerCase().includes(q) ||
          f.status.toLowerCase().includes(q)
        : true;
      const matchesDept = this.filterDepartment ? f.department === this.filterDepartment : true;
      const matchesStatus = this.filterStatus ? f.status === this.filterStatus : true;
      return matchesSearch && matchesDept && matchesStatus;
    });
    this.currentPage = 1;
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.pagedFaculty.forEach(f => f.selected = checked);
  }

  onRowsPerPageChange(): void { this.currentPage = 1; }
  prevPage(): void { if (this.currentPage > 1) this.currentPage--; }
  nextPage(): void { if (this.currentPage < this.totalPages) this.currentPage++; }
  goToPage(p: number): void { this.currentPage = p; }

  // ── Actions menu toggles ───────────────────────────────────────────────────
  toggleRowMenu(id: string, event: Event) {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  closeAllMenus() {
    this.openMenuId = null;
  }

  // ── Filters menu actions ───────────────────────────────────────────────────
  clearAllFilters() {
    this.filterDepartment = '';
    this.filterStatus = '';
    this.onSearch();
    this.showFilterMenu = false;
  }

  // ── Add Faculty ────────────────────────────────────────────────────────────
  openAddFaculty(): void {
    const nextNum = Math.max(...this.allFaculty.map(f => parseInt(f.empId.replace('EMP ', '')) || 0)) + 1;
    this.formEmpId = `EMP ${nextNum.toString().padStart(3, '0')}`;
    this.formFacultyName = '';
    this.formDepartment = 'Computer Science';
    this.formDesignation = 'Professor';
    this.formStatus = 'Active';
    this.showAddModal = true;
    this.closeAllMenus();
  }

  submitAddFaculty(): void {
    if (!this.formEmpId.trim() || !this.formFacultyName.trim() || !this.formDepartment.trim() || !this.formDesignation.trim()) {
      this.toastService.showToast('Please fill in all fields.', 'error');
      return;
    }
    if (this.allFaculty.some(f => f.empId.toLowerCase() === this.formEmpId.toLowerCase().trim())) {
      this.toastService.showToast('Employee ID already exists.', 'error');
      return;
    }

    const newRecord: FacultyRecord = {
      empId: this.formEmpId.trim().toUpperCase(),
      facultyName: this.formFacultyName.trim(),
      department: this.formDepartment.trim(),
      designation: this.formDesignation.trim(),
      status: this.formStatus,
      selected: false
    };

    this.allFaculty.unshift(newRecord);
    this.onSearch();
    this.showAddModal = false;
    this.toastService.showToast(`Faculty ${newRecord.facultyName} added successfully!`, 'success');
  }

  // ── View Faculty ───────────────────────────────────────────────────────────
  viewFaculty(faculty: FacultyRecord): void {
    this.selectedFaculty = faculty;
    this.showViewModal = true;
    this.closeAllMenus();
  }

  // ── Edit Faculty ───────────────────────────────────────────────────────────
  editFaculty(faculty: FacultyRecord): void {
    this.selectedFaculty = faculty;
    this.formEmpId = faculty.empId;
    this.formFacultyName = faculty.facultyName;
    this.formDepartment = faculty.department;
    this.formDesignation = faculty.designation;
    this.formStatus = faculty.status;
    this.showEditModal = true;
    this.closeAllMenus();
  }

  submitEditFaculty(): void {
    if (!this.formFacultyName.trim() || !this.formDepartment.trim() || !this.formDesignation.trim()) {
      this.toastService.showToast('Please fill in all fields.', 'error');
      return;
    }

    const idx = this.allFaculty.findIndex(f => f.empId === this.formEmpId);
    if (idx > -1) {
      this.allFaculty[idx].facultyName = this.formFacultyName.trim();
      this.allFaculty[idx].department = this.formDepartment.trim();
      this.allFaculty[idx].designation = this.formDesignation.trim();
      this.allFaculty[idx].status = this.formStatus;
      this.onSearch();
      this.showEditModal = false;
      this.toastService.showToast(`Faculty details updated successfully!`, 'success');
    }
  }

  // ── Delete Faculty ─────────────────────────────────────────────────────────
  deleteFaculty(faculty: FacultyRecord): void {
    if (confirm(`Are you sure you want to delete ${faculty.facultyName}?`)) {
      this.allFaculty = this.allFaculty.filter(f => f.empId !== faculty.empId);
      this.onSearch();
      this.closeAllMenus();
      this.toastService.showToast(`Faculty ${faculty.facultyName} deleted successfully.`, 'success');
    }
  }
}
