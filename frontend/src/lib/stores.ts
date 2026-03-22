// User store for managing authentication state
import { writable } from 'svelte/store';

export type UserRole = 'student' | 'faculty_advisor' | 'academic_advisor';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  profilePic?: string; // Optional profile picture URL for FA and AA only
}

export interface Request {
  id: string;
  subject: string;
  reason: string;
  date: string; // YYYY-MM-DD format
  timeSlot: string;
  dayOrder: string;
  requesterName: string;
  requesterPic?: string; // FA profile picture (from requester)
  status: 'pending' | 'accepted' | 'rejected';
}

// Mock users for testing
export const MOCK_USERS = [
  {
    email: 'student@srmist.edu.in',
    password: 'student123',
    name: 'John Doe',
    role: 'student' as UserRole
  },
  {
    email: 'fa@srmist.edu.in',
    password: 'faculty123',
    name: 'Dr. Smith',
    role: 'faculty_advisor' as UserRole,
    profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=drsmith&backgroundColor=random'
  },
  {
    email: 'aa@srmist.edu.in',
    password: 'advisor123',
    name: 'Prof. Johnson',
    role: 'academic_advisor' as UserRole,
    profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=projohnson&backgroundColor=random'
  }
];

// Mock requests for AA
export const MOCK_REQUESTS: Request[] = [
  {
    id: '1',
    subject: 'Report',
    reason: 'I need assistance with registering my courses for the next semester. I am confused about the prerequisites and course credits required for my major.',
    date: '2026-03-20',
    timeSlot: '8:00 - 8:50',
    dayOrder: 'D.O 2',
    requesterName: 'Dr. Smith',
    requesterPic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=drsmith&backgroundColor=random',
    status: 'pending'
  },
  {
    id: '2',
    subject: 'Projects',
    reason: 'My grades have been declining in recent semesters and I would like to discuss strategies to improve my academic performance. I am struggling with time management and need guidance.',
    date: '2026-03-23',
    timeSlot: '9:40 - 10:30',
    dayOrder: 'D.O 3',
    requesterName: 'Dr. Smith',
    requesterPic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=drsmith&backgroundColor=random',
    status: 'pending'
  },
  {
    id: '3',
    subject: 'Internship',
    reason: 'I am applying for internships and would like advice on my resume, cover letter, and interview preparation. Any guidance on internship selection would be helpful.',
    date: '2026-03-27',
    timeSlot: '2:40 - 3:30',
    dayOrder: 'D.O 2',
    requesterName: 'Dr. Smith',
    requesterPic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=drsmith&backgroundColor=random',
    status: 'pending'
  }
];

export const currentUser = writable<User | null>(null);
export const requests = writable<Request[]>(MOCK_REQUESTS);

// Utility function to get D.O based on date
// D.O 1-5 cycles continuously Mon-Fri, skipping weekends
// Reference: 2026-03-19 (Thursday) = D.O 1
export function getDayOrderFromDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const dayOfWeek = date.getDay();

  // Saturday (6) or Sunday (0) - no D.O
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return '';
  }

  // Reference point: March 19, 2026 (Thursday) = D.O 1
  const referenceDate = new Date('2026-03-19T00:00:00');

  // Count weekdays from reference to target date
  let weekdayCount = 0;
  let current = new Date(referenceDate);
  const isAfterReference = date > referenceDate;

  if (date.getTime() === referenceDate.getTime()) {
    // Same day as reference
    weekdayCount = 0;
  } else {
    while (current.getTime() !== date.getTime()) {
      current.setDate(current.getDate() + (isAfterReference ? 1 : -1));
      const dow = current.getDay();
      if (dow !== 0 && dow !== 6) {
        weekdayCount += isAfterReference ? 1 : -1;
      }
    }
  }

  // Calculate D.O (1-5 cycle, handles negative weekdayCount safely)
  const doNumber = ((weekdayCount % 5) + 5) % 5 + 1;
  return `D.O ${doNumber}`;
}
