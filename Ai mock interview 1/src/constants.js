export const ROLES = [
  { id: 'sde',             label: 'Software Engineer',  icon: '⚙️',  color: '#00D4FF', tags: ['DSA', 'System Design', 'OOP'] },
  { id: 'data_analyst',    label: 'Data Analyst',        icon: '📊',  color: '#A78BFA', tags: ['SQL', 'Statistics', 'Viz'] },
  { id: 'product_manager', label: 'Product Manager',     icon: '🗂️',  color: '#34D399', tags: ['Strategy', 'Metrics', 'Roadmap'] },
  { id: 'ml_engineer',     label: 'ML Engineer',         icon: '🤖',  color: '#F59E0B', tags: ['ML', 'Deep Learning', 'Python'] },
  { id: 'devops',          label: 'DevOps Engineer',     icon: '🔧',  color: '#F87171', tags: ['CI/CD', 'Docker', 'Cloud'] },
  { id: 'frontend',        label: 'Frontend Dev',        icon: '🎨',  color: '#60A5FA', tags: ['React', 'CSS', 'Performance'] },
  { id: 'backend',         label: 'Backend Dev',         icon: '🛠️',  color: '#FB923C', tags: ['APIs', 'Databases', 'Scale'] },
  { id: 'fullstack',       label: 'Full Stack Dev',      icon: '🌐',  color: '#E879F9', tags: ['React', 'Node', 'Architecture'] },
];

export const LEVELS = ['Fresher', 'Junior', 'Mid-level', 'Senior', 'Staff/Principal'];

export const MAX_QUESTIONS = 10;

// ⚠️ Replace with your free Groq API key
export const GROQ_API_KEY = process.env.REACT_APP_GROQ_KEY || '';
export const GROQ_MODEL = 'llama-3.3-70b-versatile';
