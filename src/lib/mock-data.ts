// Mock data for frontend development - replace with API calls to your Next.js backend

import { Note, Summary, User, UsageStats } from './types';

export const mockUser: User = {
  id: '1',
  email: 'demo@brieflyai.com',
  name: 'Demo User',
  createdAt: new Date('2024-01-01'),
};

export const mockNotes: Note[] = [
  {
    id: '1',
    userId: '1',
    title: 'Machine Learning Fundamentals',
    content: `Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing computer programs that can access data and use it to learn for themselves.

The process begins with observations or data, such as examples, direct experience, or instruction, to look for patterns in data and make better decisions in the future. The primary aim is to allow computers to learn automatically without human intervention.

Key concepts include:
- Supervised Learning: Training with labeled data
- Unsupervised Learning: Finding patterns in unlabeled data
- Reinforcement Learning: Learning through trial and error
- Neural Networks: Computing systems inspired by biological brains
- Deep Learning: Multiple layers of neural networks

Applications range from image recognition, speech recognition, medical diagnosis, to recommendation systems used by Netflix and Amazon.`,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    userId: '1',
    title: 'React Best Practices',
    content: `React is a JavaScript library for building user interfaces. Here are essential best practices:

Component Design:
- Keep components small and focused on a single responsibility
- Use functional components with hooks over class components
- Implement proper prop validation with TypeScript or PropTypes

State Management:
- Lift state up to the nearest common ancestor
- Use Context for global state, Redux for complex apps
- Keep state as local as possible

Performance Optimization:
- Use React.memo for expensive components
- Implement useMemo and useCallback appropriately
- Avoid inline function definitions in render
- Use code splitting with React.lazy

Testing:
- Write unit tests for utility functions
- Use React Testing Library for component tests
- Implement integration tests for critical flows`,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: '3',
    userId: '1',
    title: 'Database Normalization',
    content: `Database normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity.

First Normal Form (1NF):
- Eliminate repeating groups
- Create separate tables for each group of related data
- Identify each set of related data with a primary key

Second Normal Form (2NF):
- Meet all requirements of 1NF
- Remove subsets of data that apply to multiple rows
- Create separate tables for these subsets
- Create relationships using foreign keys

Third Normal Form (3NF):
- Meet all requirements of 2NF
- Remove columns not dependent on the primary key

Benefits of normalization include reduced storage space, easier maintenance, and prevention of update anomalies. However, over-normalization can lead to complex queries and performance issues.`,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

export const mockSummaries: Summary[] = [
  {
    id: '1',
    noteId: '1',
    type: 'summary',
    content: `• Machine learning enables systems to learn from experience without explicit programming
• Three main types: Supervised, Unsupervised, and Reinforcement Learning
• Neural networks and deep learning are key technologies
• Applications include image/speech recognition, medical diagnosis, and recommendations`,
    length: 'short',
    style: 'bullet',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    noteId: '1',
    type: 'keywords',
    content: `• Machine Learning
• Artificial Intelligence
• Supervised Learning
• Unsupervised Learning
• Reinforcement Learning
• Neural Networks
• Deep Learning
• Pattern Recognition
• Labeled Data
• Image Recognition
• Speech Recognition
• Medical Diagnosis
• Recommendation Systems
• Data-driven Learning`,
    createdAt: new Date('2024-01-16'),
  },
];

export const mockUsageStats: UsageStats = {
  summariesUsedToday: 3,
  maxSummariesPerDay: 10,
  keywordsUsedToday: 2,
  maxKeywordsPerDay: 10,
};

// Simulated API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
