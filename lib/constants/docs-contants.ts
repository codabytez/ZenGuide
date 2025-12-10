import { Book, Code2, FileText, HelpCircle, Settings, Zap } from 'lucide-react';


export const SECTIONS = [
  { id: 'getting-started', icon: Book, title: 'Getting Started' },
  { id: 'installation', icon: Code2, title: 'Installation' },
  { id: 'configuration', icon: Settings, title: 'Configuration' },
  { id: 'api', icon: Zap, title: 'API Reference' },
  { id: 'examples', icon: FileText, title: 'Examples' },
  { id: 'faq', icon: HelpCircle, title: 'FAQ' },
];

export const FAQ = [
  {
    question: 'What is ZenGuide?',
    answer:
      'ZenGuide is an onboarding tour platform that helps you create interactive tours for your web applications.',
  },
  {
    question: 'How do I install ZenGuide?',
    answer:
      'You can install ZenGuide by adding our widget script to your application and configuring it with your tour ID.',
  },
  {
    question: 'Is ZenGuide free to use?',
    answer:
    'Yes, ZenGuide is completely free to use for all users.',
  },
 ]