import { Component } from '@angular/core';
import { SubTabItem } from '@libs/sub-tabs';

interface ReceivedSwap {
  id: string;
  sender: string;
  avatar?: string;
  dutyType: string;
  date: string;
  time: string;
  location: string;
  reason: string;
  status: 'pending' | 'accepted' | 'rejected';
  imageError?: boolean;
}

interface ActiveSwap {
  id: string;
  dutyType: string;
  status: string;
  date: string;
  time: string;
  location: string;
  assignedBy: string;
  swapWith: string;
  reason: string;
}

interface HistorySwap {
  id: string;
  dutyType: string;
  status: 'Approved' | 'Declined' | 'Completed';
  date: string;
  time: string;
  location: string;
  assignedBy: string;
  swapWith: string;
}

@Component({
  selector: 'app-swap-duties',
  templateUrl: './swap-duties.component.html',
  styleUrls: ['./swap-duties.component.css']
})
export class SwapDutiesComponent {
  activeSubTab: 'received' | 'active-history' = 'received';

  subTabs: SubTabItem[] = [
    { id: 'received', label: 'Received Swap' },
    { id: 'active-history', label: 'Active and History' }
  ];

  // Received Swap state
  receivedSwaps: ReceivedSwap[] = [
    {
      id: 'r1',
      sender: 'Dr. Maria William',
      dutyType: 'Exam Duty',
      date: '22 May 2026',
      time: '9:00 AM - 12:00 PM',
      location: 'Admin Block A 101',
      reason: 'I have a meeting',
      status: 'pending'
    },
    {
      id: 'r2',
      sender: 'Dr. Maria William',
      dutyType: 'Exam Duty',
      date: '22 May 2026',
      time: '9:00 AM - 12:00 PM',
      location: 'Admin Block A 101',
      reason: 'I have a meeting',
      status: 'pending'
    }
  ];

  // Active Swap state
  activeSwaps: ActiveSwap[] = [
    {
      id: 'a1',
      dutyType: 'Exam Duty',
      status: 'Assigned',
      date: '24 - Jun - 2026',
      time: '9:00 AM - 12:00 PM',
      location: 'M 405',
      assignedBy: 'Dr. Alice Green',
      swapWith: 'Prof. James Ward',
      reason: 'Need to attend a seminar'
    },
    {
      id: 'a2',
      dutyType: 'Admission Duty',
      status: 'Assigned',
      date: '24 - Jun - 2026',
      time: '9:00 AM - 12:00 PM',
      location: 'M 405',
      assignedBy: 'Dr. Alice Green',
      swapWith: 'Prof. James Ward',
      reason: 'Personal engagement'
    }
  ];

  // Swap History state
  swapHistory: HistorySwap[] = [
    {
      id: 'h1',
      dutyType: 'Exam Duty',
      status: 'Approved',
      date: '10 - May - 2026',
      time: '8:00 AM - 11:00 AM',
      location: 'A 101',
      assignedBy: 'Dr. Sarah Lee',
      swapWith: 'Dr. Mark Hale'
    },
    {
      id: 'h2',
      dutyType: 'Exam Duty',
      status: 'Declined',
      date: '02 - Apr - 2026',
      time: '2:00 PM - 5:00 PM',
      location: 'C 310',
      assignedBy: 'Prof. Nina Ross',
      swapWith: 'Dr. Tom Chan'
    },
    {
      id: 'h3',
      dutyType: 'Exam Duty',
      status: 'Completed',
      date: '15 - Mar - 2026',
      time: '9:00 AM - 12:00 PM',
      location: 'M 102',
      assignedBy: 'Dr. Alice Green',
      swapWith: 'Prof. James Ward'
    }
  ];

  facultyMembers = [
    { id: 1, name: 'Dr. Sarah Jacob' },
    { id: 2, name: 'Dr. Sevuga Pandian' },
    { id: 3, name: 'Dr. Maria William' },
    { id: 4, name: 'Prof. Alwyn' },
    { id: 5, name: 'Prof. James Ward' },
    { id: 6, name: 'Dr. Mark Hale' },
    { id: 7, name: 'Dr. Tom Chan' }
  ];

  // Edit Swap modal state
  showEditModal: boolean = false;
  editingSwap: ActiveSwap | null = null;
  selectedEditFacultyItems: any[] = [];
  editSwapReason: string = '';

  selectSubTab(tab: string) {
    this.activeSubTab = tab as 'received' | 'active-history';
  }

  acceptSwap(id: string) {
    const swap = this.receivedSwaps.find(s => s.id === id);
    if (swap) {
      swap.status = 'accepted';
      alert(`Swap request from ${swap.sender} accepted!`);
    }
  }

  rejectSwap(id: string) {
    const swap = this.receivedSwaps.find(s => s.id === id);
    if (swap) {
      swap.status = 'rejected';
      alert(`Swap request from ${swap.sender} rejected.`);
    }
  }

  cancelSwap(id: string) {
    const confirmCancel = confirm('Are you sure you want to cancel this swap request?');
    if (confirmCancel) {
      const idx = this.activeSwaps.findIndex(s => s.id === id);
      if (idx !== -1) {
        const removed = this.activeSwaps.splice(idx, 1)[0];
        // Move to history as Declined/Cancelled
        this.swapHistory.unshift({
          id: 'h_cancelled_' + Date.now(),
          dutyType: removed.dutyType,
          status: 'Declined',
          date: removed.date,
          time: removed.time,
          location: removed.location,
          assignedBy: removed.assignedBy,
          swapWith: removed.swapWith
        });
        alert('Swap request cancelled successfully.');
      }
    }
  }

  openEditModal(swap: ActiveSwap) {
    this.editingSwap = swap;
    const member = this.facultyMembers.find(f => f.name === swap.swapWith);
    this.selectedEditFacultyItems = member ? [member] : [];
    this.editSwapReason = swap.reason || '';
    this.showEditModal = true;
  }

  onFacultyEditSelectionChange(items: any[]) {
    this.selectedEditFacultyItems = items;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingSwap = null;
    this.selectedEditFacultyItems = [];
    this.editSwapReason = '';
  }

  submitEditSwap() {
    if (!this.selectedEditFacultyItems.length || !this.editSwapReason.trim()) {
      alert('Please select a faculty member and enter a reason.');
      return;
    }
    if (this.editingSwap) {
      this.editingSwap.swapWith = this.selectedEditFacultyItems[0].name;
      this.editingSwap.reason = this.editSwapReason;
      alert('Swap request updated successfully.');
      this.closeEditModal();
    }
  }
}
