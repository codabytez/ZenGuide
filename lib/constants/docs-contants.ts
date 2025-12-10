import { Book, Code2, FileText, HelpCircle, Settings, Zap } from 'lucide-react';


export const GETTING_STARTED_STEPS = [
    { id: 'create-account', title: 'Create an account and access your dashboard' },
    { id: 'create-tour', title: 'Create a new tour and add your steps (minimum of 5)' },
    { id: 'copy-embed-code', title: 'Copy the code for your tour' },
    { id: 'paste-embed-code', title: "Paste the code into your website's HTML or Layout for frameworks" },
    { id: 'monitor-analytics', title: 'You can then monitor your tours analytics in the dashboard' },
]


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
