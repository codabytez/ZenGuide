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
                  { q: 'Can I customize the widget appearance?', a: 'Yes! You can customize colors, fonts, and animations through the dashboard or via CSS variables.' },
                  { q: 'Does it work with React/Vue/Angular?', a: 'ZenGuide works with any framework or vanilla JavaScript. Just add the script tag and initialize.' },
                  { q: 'How does analytics tracking work?', a: 'We automatically track step views, completions, and skips. View detailed analytics in your dashboard.' },
                  { q: 'Is it mobile-friendly?', a: 'Absolutely! The widget is fully responsive and works great on all devices.' },
                ]