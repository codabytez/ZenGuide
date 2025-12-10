import { Book, Code2, HelpCircle } from 'lucide-react';


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
    { id: 'faq', icon: HelpCircle, title: 'FAQ' },
  ];

  export const FAQ = [
                  { q: 'Does it work with frameworks?', a: 'ZenGuide works with any framework, just create a tour in the dasboard copy and paste the script in your code' },
                  { q: 'How does analytics tracking work?', a: 'It tracks the view of each steps you created as well as the amount of completed steps' },
                  { q: 'Is it mobile-friendly?', a: 'Yes, it is mobile friendly it can work on any device.' },
                ]