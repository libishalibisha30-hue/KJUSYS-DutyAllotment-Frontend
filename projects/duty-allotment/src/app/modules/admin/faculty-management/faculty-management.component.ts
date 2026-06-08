import { Component, OnInit } from '@angular/core';

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

  searchQuery = '';

  allFaculty: FacultyRecord[] = [
    { empId: 'EMP 011', facultyName: 'Dr. John',  department: 'Computer Science', designation: 'Professor',  status: 'On Leave', selected: false },
    { empId: 'EMP 015', facultyName: 'Kevin',     department: 'Computer Science', designation: 'Professor',  status: 'On Leave', selected: false },
    { empId: 'EMP 022', facultyName: 'Mary',      department: 'Computer Science', designation: 'Proffessor', status: 'Active',   selected: false },
    { empId: 'EMP 023', facultyName: 'Mary',      department: 'Computer Science', designation: 'Proffessor', status: 'Active',   selected: false },
    { empId: 'EMP 024', facultyName: 'Mary',      department: 'Computer Science', designation: 'Proffessor', status: 'Active',   selected: false },
    { empId: 'EMP 025', facultyName: 'Mary',      department: 'Computer Science', designation: 'Proffessor', status: 'Active',   selected: false },
    { empId: 'EMP 026', facultyName: 'Mary',      department: 'Computer Science', designation: 'Proffessor', status: 'Active',   selected: false },
    { empId: 'EMP 027', facultyName: 'Mary',      department: 'Computer Science', designation: 'Proffessor', status: 'Active',   selected: false },
    { empId: 'EMP 028', facultyName: 'Mary',      department: 'Computer Science', designation: 'Proffessor', status: 'Active',   selected: false },
    { empId: 'EMP 029', facultyName: 'Mary',      department: 'Computer Science', designation: 'Proffessor', status: 'Active',   selected: false },
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
    this.filteredFaculty = q
      ? this.allFaculty.filter(f =>
          f.empId.toLowerCase().includes(q) ||
          f.facultyName.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q) ||
          f.designation.toLowerCase().includes(q) ||
          f.status.toLowerCase().includes(q))
      : [...this.allFaculty];
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

  openAddFaculty(): void {
    // TODO: Open add-faculty modal or navigate to add-faculty form
    console.log('Add Faculty clicked');
  }

  viewFaculty(faculty: FacultyRecord): void {
    console.log('View faculty:', faculty.empId);
  }

  editFaculty(faculty: FacultyRecord): void {
    console.log('Edit faculty:', faculty.empId);
  }

  deleteFaculty(faculty: FacultyRecord): void {
    console.log('Delete faculty:', faculty.empId);
  }
}
