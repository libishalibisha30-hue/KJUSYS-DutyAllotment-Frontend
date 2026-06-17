import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SharedToastService } from '@libs/shared-auth';
import { FacultyService } from './faculty.service';

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

  constructor(
    private toastService: SharedToastService,
    private facultyService: FacultyService,
    private cdr: ChangeDetectorRef
  ) { }

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

  allFaculty: FacultyRecord[] = [];

  filteredFaculty: FacultyRecord[] = [];

  // ── Pagination ──────────────────────────────────────────────────────────────
  rowsPerPage = 10;
  currentPage = 1;

  get totalItems(): number { return this.filteredFaculty.length; }
  get totalPages(): number { return Math.max(1, Math.ceil(this.totalItems / this.rowsPerPage)); }
  get rangeStart(): number { return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.rowsPerPage + 1; }
  get rangeEnd(): number { return Math.min(this.currentPage * this.rowsPerPage, this.totalItems); }

  get pagedFaculty(): FacultyRecord[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredFaculty.slice(start, start + this.rowsPerPage);
  }

  get visiblePages(): number[] {
    const max = 5;
    let start = Math.max(1, this.currentPage - Math.floor(max / 2));
    let end = Math.min(this.totalPages, start + max - 1);
    start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  get allSelected(): boolean {
    return this.pagedFaculty.length > 0 && this.pagedFaculty.every(f => f.selected);
  }

  mockFacultyData: FacultyRecord[] = [];

  ngOnInit(): void {
    this.allFaculty = [...this.mockFacultyData];
    this.loadFacultyFromBackend();
  }

  loadFacultyFromBackend(): void {
    this.facultyService.getFacultyList().subscribe({
      next: (response) => {
        // Handle response wrapper { statusCode, type, responseData: { data: { faculty: [...] } } }
        const facultyList = response?.responseData?.data?.faculty;
        if (facultyList && Array.isArray(facultyList)) {
          this.allFaculty = facultyList.map(item => ({
            empId: item.employeeId || item.empId || item.id || '',
            facultyName: item.name || item.facultyName || '',
            department: item.department || '',
            designation: item.designation || '',
            status: this.mapStatus(item.status),
            selected: false
          }));
          this.filteredFaculty = [...this.allFaculty];
        } else if (response && Array.isArray(response)) {
          // Fallback if response is directly an array
          this.allFaculty = response.map(item => ({
            empId: item.employeeId || item.empId || item.id || '',
            facultyName: item.name || item.facultyName || '',
            department: item.department || '',
            designation: item.designation || '',
            status: this.mapStatus(item.status),
            selected: false
          }));
          this.filteredFaculty = [...this.allFaculty];
        } else {
          this.allFaculty = [...this.mockFacultyData];
          this.filteredFaculty = [...this.allFaculty];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.warn('Failed to load faculty from backend. Using local mock data. Error:', err);
        this.allFaculty = [...this.mockFacultyData];
        this.filteredFaculty = [...this.allFaculty];
        this.cdr.detectChanges();
      }
    });
  }

  private mapStatus(status: string): 'Active' | 'On Leave' | 'Inactive' {
    if (!status) return 'Active';
    const s = status.toLowerCase().trim();
    if (s === 'onleave' || s === 'on leave') {
      return 'On Leave';
    }
    if (s === 'unavailable' || s === 'inactive') {
      return 'Inactive';
    }
    return 'Active';
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
    this.formEmpId = '';
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

    this.facultyService.addFaculty(newRecord).subscribe({
      next: (res) => {
        this.toastService.showToast(`Faculty ${newRecord.facultyName} added on backend successfully!`, 'success');
        this.loadFacultyFromBackend();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.warn('Failed to add faculty to backend. Adding locally (offline). Error:', err);
        this.allFaculty.unshift(newRecord);
        this.onSearch();
        this.toastService.showToast(`Faculty ${newRecord.facultyName} added locally (offline mode).`, 'info');
        this.cdr.detectChanges();
      }
    });

    this.showAddModal = false;
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
      const updatedStatus = this.formStatus;

      // Update locally first
      this.allFaculty[idx].facultyName = this.formFacultyName.trim();
      this.allFaculty[idx].department = this.formDepartment.trim();
      this.allFaculty[idx].designation = this.formDesignation.trim();
      this.allFaculty[idx].status = updatedStatus;

      this.facultyService.updateFacultyStatus(this.formEmpId, updatedStatus).subscribe({
        next: (res) => {
          this.toastService.showToast(`Faculty status updated on backend.`, 'success');
          this.loadFacultyFromBackend();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.warn('Failed to update status on backend. Local state preserved. Error:', err);
          this.onSearch();
          this.toastService.showToast(`Faculty details updated locally (offline mode).`, 'info');
          this.cdr.detectChanges();
        }
      });

      this.showEditModal = false;
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
