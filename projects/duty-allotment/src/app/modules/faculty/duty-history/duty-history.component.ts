import { Component } from '@angular/core';

interface HistoryDuty {
  id: string;
  employId: string;
  dutyName: string;
  date: string;
  eventName: string;
  status: string;
  assignee: string;
}

@Component({
  selector: 'app-duty-history',
  templateUrl: './duty-history.component.html',
  styleUrls: ['./duty-history.component.css']
})
export class DutyHistoryComponent {
  searchQuery: string = '';
  rowsPerPage: number = 10;
  currentPage: number = 1;
  totalRows: number = 25;

  historyList: HistoryDuty[] = [
    {
      id: '1',
      employId: 'PO-2023-011',
      dutyName: 'Exam Duty',
      date: 'Apr 5, 2026',
      eventName: 'End Sem Exam',
      status: 'Completed',
      assignee: 'Alice Green'
    },
    {
      id: '2',
      employId: 'PO-2023-015',
      dutyName: 'Admission Duty',
      date: 'Apr 1, 2026',
      eventName: 'Verification',
      status: 'Completed',
      assignee: 'Alice Green'
    },
    {
      id: '3',
      employId: 'PO-2023-022',
      dutyName: 'Documentation verification',
      date: 'Mar 25, 2026',
      eventName: 'Collection',
      status: 'Completed',
      assignee: 'Alice Green'
    }
  ];

  get filteredHistory(): HistoryDuty[] {
    return this.historyList.filter(item => {
      const query = this.searchQuery.toLowerCase();
      return (
        item.employId.toLowerCase().includes(query) ||
        item.dutyName.toLowerCase().includes(query) ||
        item.date.toLowerCase().includes(query) ||
        item.eventName.toLowerCase().includes(query) ||
        item.assignee.toLowerCase().includes(query)
      );
    });
  }

  onSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }

  onRowsChange(event: Event) {
    this.rowsPerPage = parseInt((event.target as HTMLSelectElement).value, 10);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onExport() {
    alert('Exporting duty history...');
  }

  onOpenFilters() {
    alert('Opening filter options...');
  }

  onOpenDateRange() {
    alert('Opening date range picker...');
  }

  viewDetails(id: string) {
    alert(`Viewing details for duty ID: ${id}`);
  }

  editDuty(id: string) {
    alert(`Editing duty ID: ${id}`);
  }

  deleteDuty(id: string) {
    if (confirm('Are you sure you want to delete this duty record?')) {
      this.historyList = this.historyList.filter(item => item.id !== id);
    }
  }
}
