import { Component } from '@angular/core';

interface ReceivedSwap {
  id: string;
  sender: string;
  avatar: string;
  dutyType: string;
  date: string;
  time: string;
  location: string;
  reason: string;
  status: 'pending' | 'accepted' | 'rejected';
  imageError?: boolean;
}

@Component({
  selector: 'app-swap-duties',
  templateUrl: './swap-duties.component.html',
  styleUrls: ['./swap-duties.component.css']
})
export class SwapDutiesComponent {
  activeSubTab: 'request' | 'received' = 'request';
  
  // Request Swap Form state
  selectedFacultyItems: any[] = [];
  swapReason: string = '';
  
  myDuty = {
    type: 'Interview Duty',
    date: '21 - May - 2026',
    time: '10:00 AM - 11:00 PM',
    locationBuilding: 'Admin block',
    locationRoom: 'A302'
  };

  facultyMembers: { id: number; name: string }[] = [
    { id: 1, name: 'Dr. Sarah Jacob' },
    { id: 2, name: 'Dr. Sevuga Pandian' },
    { id: 3, name: 'Dr. Maria William' },
    { id: 4, name: 'Prof. Alwyn' }
  ];

  onFacultySelectionChange(items: any[]) {
    this.selectedFacultyItems = items;
  }

  // Received Swap state
  receivedSwaps: ReceivedSwap[] = [
    {
      id: '1',
      sender: 'Dr. maria william',
      avatar: 'assets/images/Avatar.jpg', // Faculty avatar path
      dutyType: 'Exam Duty',
      date: '22 may 2026',
      time: '9:00 AM - 12:00 PM',
      location: 'Block A 101',
      reason: 'I have a meeting',
      status: 'pending'
    }
  ];


  selectSubTab(tab: 'request' | 'received') {
    this.activeSubTab = tab;
  }

  onSubmitSwap() {
    if (!this.selectedFacultyItems.length || !this.swapReason.trim()) {
      alert('Please select a faculty member and provide a reason.');
      return;
    }
    const facultyName = this.selectedFacultyItems[0].name;
    // Simulate submission
    alert(`Swap request with ${facultyName} submitted successfully!`);
    this.selectedFacultyItems = [];
    this.swapReason = '';
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
}
