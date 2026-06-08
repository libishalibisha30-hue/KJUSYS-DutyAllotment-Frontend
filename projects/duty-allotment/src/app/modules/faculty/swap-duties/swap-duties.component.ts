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
  selectedFaculty: string = '';
  swapReason: string = '';
  isDropdownOpen: boolean = false;
  
  myDuty = {
    type: 'Interview Duty',
    date: '21 - May - 2026',
    time: '10:00 AM - 11:00 PM',
    locationBuilding: 'Admin block',
    locationRoom: 'A302'
  };

  facultyMembers: string[] = [
    'Dr. Sarah Jacob',
    'Dr. sevuga pandian',
    'Dr. maria william',
    'Prof. Alwyn'
  ];

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

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectFaculty(member: string) {
    this.selectedFaculty = member;
    this.isDropdownOpen = false;
  }

  onSubmitSwap() {
    if (!this.selectedFaculty || !this.swapReason.trim()) {
      alert('Please select a faculty member and provide a reason.');
      return;
    }
    
    // Simulate submission
    alert(`Swap request with ${this.selectedFaculty} submitted successfully!`);
    this.selectedFaculty = '';
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
