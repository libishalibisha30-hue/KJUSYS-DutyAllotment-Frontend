import { Component } from '@angular/core';

interface HistoryDuty {
  id: string;
  employId: string;
  dutyName: string;
  date: string;
  eventName: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
  assignee: string;
}

@Component({
  selector: 'app-duty-history',
  templateUrl: './duty-history.component.html',
  styleUrls: ['./duty-history.component.css']
})
export class DutyHistoryComponent {

  // ─── Search & Filter State ───────────────────────────────────────────
  searchQuery: string = '';
  filterStatus: string = '';
  dateFrom: string = '';
  dateTo: string = '';

  // ─── Pagination State ────────────────────────────────────────────────
  rowsPerPage: number = 10;
  currentPage: number = 1;

  // ─── Sorting State ───────────────────────────────────────────────────
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // ─── Modal / Panel State ─────────────────────────────────────────────
  showViewModal: boolean = false;
  viewingItem: HistoryDuty | null = null;

  showEditModal: boolean = false;
  editingItem: HistoryDuty | null = null;
  editDutyName: string = '';
  editEventName: string = '';
  editAssignee: string = '';
  editStatus: string = '';

  showFilterPanel: boolean = false;
  showDatePanel: boolean = false;

  // ─── Row three-dot menu state ──────────────────────────────
  openMenuId: string | null = null;

  toggleRowMenu(id: string, event: Event) {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === id ? null : id;
    // also close filter/date panels
    this.showFilterPanel = false;
    this.showDatePanel = false;
  }

  closeAllMenus() {
    this.openMenuId = null;
    this.showFilterPanel = false;
    this.showDatePanel = false;
  }

  // ─── Full Data List ──────────────────────────────────────────────────
  historyList: HistoryDuty[] = [
    { id: '1',  employId: 'PO-2023-011', dutyName: 'Exam Duty',                  date: 'Apr 5, 2026',  eventName: 'End Sem Exam',       status: 'Completed', assignee: 'Alice Green'  },
    { id: '2',  employId: 'PO-2023-015', dutyName: 'Admission Duty',              date: 'Apr 1, 2026',  eventName: 'Verification',       status: 'Completed', assignee: 'Alice Green'  },
    { id: '3',  employId: 'PO-2023-022', dutyName: 'Documentation Verification',  date: 'Mar 25, 2026', eventName: 'Collection',         status: 'Completed', assignee: 'Alice Green'  },
    { id: '4',  employId: 'PO-2023-031', dutyName: 'Invigilation Duty',           date: 'Mar 20, 2026', eventName: 'Mid Sem Exam',       status: 'Completed', assignee: 'Bob Smith'    },
    { id: '5',  employId: 'PO-2023-040', dutyName: 'Lab Duty',                    date: 'Mar 15, 2026', eventName: 'Lab Assessment',     status: 'Completed', assignee: 'Carol White'  },
    { id: '6',  employId: 'PO-2023-048', dutyName: 'Exam Duty',                   date: 'Mar 10, 2026', eventName: 'Practical Exam',     status: 'Pending',   assignee: 'David Brown'  },
    { id: '7',  employId: 'PO-2023-055', dutyName: 'Counselling Duty',            date: 'Mar 5, 2026',  eventName: 'Student Counselling',status: 'Completed', assignee: 'Alice Green'  },
    { id: '8',  employId: 'PO-2023-062', dutyName: 'Admission Duty',              date: 'Feb 28, 2026', eventName: 'Application Review', status: 'Completed', assignee: 'Eve Johnson'  },
    { id: '9',  employId: 'PO-2023-070', dutyName: 'Exam Duty',                   date: 'Feb 22, 2026', eventName: 'Internal Exam',      status: 'Completed', assignee: 'Bob Smith'    },
    { id: '10', employId: 'PO-2023-078', dutyName: 'Lab Duty',                    date: 'Feb 18, 2026', eventName: 'Lab Viva',           status: 'Cancelled', assignee: 'Carol White'  },
    { id: '11', employId: 'PO-2023-085', dutyName: 'Invigilation Duty',           date: 'Feb 12, 2026', eventName: 'Mid Sem Exam',       status: 'Completed', assignee: 'David Brown'  },
    { id: '12', employId: 'PO-2023-092', dutyName: 'Exam Duty',                   date: 'Feb 8, 2026',  eventName: 'End Sem Exam',       status: 'Completed', assignee: 'Alice Green'  },
    { id: '13', employId: 'PO-2023-100', dutyName: 'Documentation Verification',  date: 'Feb 3, 2026',  eventName: 'Document Check',     status: 'Completed', assignee: 'Eve Johnson'  },
    { id: '14', employId: 'PO-2023-108', dutyName: 'Admission Duty',              date: 'Jan 29, 2026', eventName: 'Fee Verification',   status: 'Pending',   assignee: 'Bob Smith'    },
    { id: '15', employId: 'PO-2023-115', dutyName: 'Counselling Duty',            date: 'Jan 24, 2026', eventName: 'Career Counselling', status: 'Completed', assignee: 'Carol White'  },
    { id: '16', employId: 'PO-2023-122', dutyName: 'Exam Duty',                   date: 'Jan 20, 2026', eventName: 'Practical Exam',     status: 'Completed', assignee: 'Alice Green'  },
    { id: '17', employId: 'PO-2023-130', dutyName: 'Lab Duty',                    date: 'Jan 15, 2026', eventName: 'Lab Assessment',     status: 'Completed', assignee: 'David Brown'  },
    { id: '18', employId: 'PO-2023-138', dutyName: 'Invigilation Duty',           date: 'Jan 10, 2026', eventName: 'Model Exam',         status: 'Cancelled', assignee: 'Eve Johnson'  },
    { id: '19', employId: 'PO-2023-145', dutyName: 'Admission Duty',              date: 'Jan 5, 2026',  eventName: 'Document Collection',status: 'Completed', assignee: 'Bob Smith'    },
    { id: '20', employId: 'PO-2023-152', dutyName: 'Exam Duty',                   date: 'Dec 30, 2025', eventName: 'Supplementary Exam', status: 'Completed', assignee: 'Alice Green'  },
    { id: '21', employId: 'PO-2023-160', dutyName: 'Lab Duty',                    date: 'Dec 25, 2025', eventName: 'Lab Viva',           status: 'Completed', assignee: 'Carol White'  },
    { id: '22', employId: 'PO-2023-168', dutyName: 'Documentation Verification',  date: 'Dec 20, 2025', eventName: 'Record Submission',  status: 'Completed', assignee: 'David Brown'  },
    { id: '23', employId: 'PO-2023-175', dutyName: 'Counselling Duty',            date: 'Dec 15, 2025', eventName: 'Student Meeting',    status: 'Pending',   assignee: 'Eve Johnson'  },
    { id: '24', employId: 'PO-2023-182', dutyName: 'Exam Duty',                   date: 'Dec 10, 2025', eventName: 'End Sem Exam',       status: 'Completed', assignee: 'Bob Smith'    },
    { id: '25', employId: 'PO-2023-190', dutyName: 'Invigilation Duty',           date: 'Dec 5, 2025',  eventName: 'Arrear Exam',        status: 'Completed', assignee: 'Alice Green'  }
  ];

  // ─── Helper: parse display date string ("Apr 5, 2026") → Date ────
  private parseDateStr(dateStr: string): Date | null {
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? null : d;
    } catch { return null; }
  }

  // ─── Computed: Filtered + Sorted + Paginated ─────────────────────────
  get filteredSortedHistory(): HistoryDuty[] {
    let list = this.historyList.filter(item => {
      const query = this.searchQuery.toLowerCase();
      const matchSearch = !query || (
        item.employId.toLowerCase().includes(query) ||
        item.dutyName.toLowerCase().includes(query) ||
        item.date.toLowerCase().includes(query) ||
        item.eventName.toLowerCase().includes(query) ||
        item.assignee.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
      );
      const matchStatus = !this.filterStatus || item.status === this.filterStatus;

      // Date range filter
      const fromDate = this.dateFrom ? new Date(this.dateFrom + 'T00:00:00') : null;
      const toDate   = this.dateTo   ? new Date(this.dateTo   + 'T23:59:59') : null;
      let matchDate = true;
      if (fromDate || toDate) {
        const itemDate = this.parseDateStr(item.date);
        if (itemDate) {
          if (fromDate && itemDate < fromDate) matchDate = false;
          if (toDate   && itemDate > toDate)   matchDate = false;
        } else {
          matchDate = false;
        }
      }

      return matchSearch && matchStatus && matchDate;
    });

    if (this.sortColumn) {
      list = [...list].sort((a, b) => {
        const valA = (a as any)[this.sortColumn]?.toLowerCase() ?? '';
        const valB = (b as any)[this.sortColumn]?.toLowerCase() ?? '';
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return list;
  }

  get totalFilteredRows(): number {
    return this.filteredSortedHistory.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalFilteredRows / this.rowsPerPage));
  }

  get pagedHistory(): HistoryDuty[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredSortedHistory.slice(start, start + this.rowsPerPage);
  }

  get startRow(): number {
    if (this.totalFilteredRows === 0) return 0;
    return (this.currentPage - 1) * this.rowsPerPage + 1;
  }

  get endRow(): number {
    return Math.min(this.currentPage * this.rowsPerPage, this.totalFilteredRows);
  }

  get pageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    return pages;
  }

  // ─── Search ──────────────────────────────────────────────────────────
  onSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
  }

  // ─── Sort ────────────────────────────────────────────────────────────
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
  }

  // ─── Pagination ──────────────────────────────────────────────────────
  onRowsChange(event: Event) {
    this.rowsPerPage = parseInt((event.target as HTMLSelectElement).value, 10);
    this.currentPage = 1;
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // ─── View Details Modal ──────────────────────────────────────────────
  viewDetails(id: string) {
    this.openMenuId = null;
    this.viewingItem = this.historyList.find(i => i.id === id) || null;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.viewingItem = null;
  }

  // ─── Edit Modal ──────────────────────────────────────────────────────
  editDuty(id: string) {
    this.openMenuId = null;
    const item = this.historyList.find(i => i.id === id);
    if (item) {
      this.editingItem = item;
      this.editDutyName = item.dutyName;
      this.editEventName = item.eventName;
      this.editAssignee = item.assignee;
      this.editStatus = item.status;
      this.showEditModal = true;
    }
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingItem = null;
  }

  saveEdit() {
    if (!this.editDutyName.trim() || !this.editEventName.trim() || !this.editAssignee.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    if (this.editingItem) {
      this.editingItem.dutyName = this.editDutyName;
      this.editingItem.eventName = this.editEventName;
      this.editingItem.assignee = this.editAssignee;
      this.editingItem.status = this.editStatus as any;
    }
    this.closeEditModal();
  }

  // ─── Delete ──────────────────────────────────────────────────────────
  deleteDuty(id: string) {
    this.openMenuId = null;
    if (confirm('Are you sure you want to delete this duty record?')) {
      this.historyList = this.historyList.filter(item => item.id !== id);
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    }
  }

  // ─── Filter Panel ────────────────────────────────────────────────────
  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
    this.showDatePanel = false;
  }

  applyFilters() {
    this.currentPage = 1;
    this.showFilterPanel = false;
  }

  clearFilters() {
    this.filterStatus = '';
    this.currentPage = 1;
    this.showFilterPanel = false;
  }

  // ─── Date Range Panel ────────────────────────────────────────────────
  toggleDatePanel() {
    this.showDatePanel = !this.showDatePanel;
    this.showFilterPanel = false;
  }

  applyDateRange() {
    this.currentPage = 1;
    this.showDatePanel = false;
  }

  clearDateRange() {
    this.dateFrom = '';
    this.dateTo = '';
    this.currentPage = 1;
    this.showDatePanel = false;
  }

  // ─── Export CSV ──────────────────────────────────────────────────────
  onExport() {
    const headers = ['Employee ID', 'Duty Name', 'Date', 'Event Name', 'Status', 'Assignee'];
    const rows = this.filteredSortedHistory.map(item =>
      [item.employId, item.dutyName, item.date, item.eventName, item.status, item.assignee]
        .map(v => `"${v}"`)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'duty_history.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
