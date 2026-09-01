import type { Profile, SkillCategory, ExperienceItem, ProjectItem, EducationItem } from '../types';

export const fallbackProfile: Profile = {
  name: 'Manish Kumar',
  headline: 'Generative AI & Backend Systems Engineer',
  tagline: 'Crafting high-throughput FastAPI microservices, agentic AI pipelines & computer vision architectures.',
  bio: 'Electrical Engineering undergraduate at IIT Mandi with hands-on industry experience in Generative AI, LLM multi-agent orchestration, speech/lip-sync data pipelines, and medical image segmentation. Passionate about building robust, high-performance backends and cutting-edge deep learning systems.',
  location: 'Himachal Pradesh / Indore, India',
  available_for_hire: true,
  avatar_url: '/avatar.jpg',
  socials: {
    github: 'https://github.com/manishiitmandi',
    linkedin: 'https://www.linkedin.com/in/manish-kumar-0067a42a0/',
    leetcode: 'https://leetcode.com/manish_iitm',
    codeforces: 'https://codeforces.com/profile/manish_iitm',
    email: 'manish.iitm484@gmail.com',
    phone: '+91 9872095834',
  },
  stats: {
    projects_completed: 8,
    cgpa: '8.07',
    years_experience: '1+',
    hackathons_won: 2,
    contributions: '500+',
  },
};

export const fallbackProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Graph-Based Neural Cellular Automata (ViG-UNet)',
    category: 'AI / Medical Imaging',
    description: 'Graph Neural Network architecture integrating Vision GNN into UNet for retinal vessel segmentation with dynamic patch routing.',
    full_description: 'Engineered an end-to-end deep learning framework combining Vision GNN (ViG) and Cellular Automata dynamics for high-precision micro-vessel segmentation across DRIVE and STARE retinal datasets.',
    tags: ['PyTorch', 'Vision GNN', 'Medical Imaging', 'UNet', 'FastAPI'],
    metrics: 'Dice score: 0.84 vs 0.81 ViG-UNet baseline',
    github_url: 'https://github.com/manishiitmandi',
    demo_url: '',
    featured: true,
    architecture: [
      'CLAHE Contrast Enhancement & Patch Normalization',
      'Dynamic Graph Feature Space Formulation',
      'Local Patch Interaction & Node Updates',
      'Cellular Automaton Iterative Mask Refinement',
    ],
  },
  {
    id: 'proj-2',
    title: 'Multi-Tenant Agentic Document Intelligence Platform',
    category: 'Backend & Systems',
    description: 'Distributed document ingestion system with hybrid semantic search, OCR extraction, and cryptographic RBAC authentication.',
    full_description: 'Designed a high-throughput multi-tenant FastAPI backend that ingests multi-format documents, generates vector embeddings, and performs hybrid BM25 + dense semantic retrieval.',
    tags: ['FastAPI', 'PostgreSQL', 'SQLAlchemy', 'JWT Auth', 'Redis', 'Docker'],
    metrics: 'Sub-45ms P99 search latency across 50k+ records',
    github_url: 'https://github.com/manishiitmandi',
    demo_url: '',
    featured: true,
    architecture: [
      'FastAPI Ingestion Gateway & Rate Limiter',
      'Background Task Queue for OCR & Chunking',
      'Hybrid Vector & Keyword Indexing in Cloud PostgreSQL',
      'Sub-50ms Response Stream with JWT RBAC Security',
    ],
  },
  {
    id: 'proj-3',
    title: 'Real-Time Geospatial Land Surface Analysis Engine',
    category: 'Computer Vision & Geospatial',
    description: 'Processing pipeline for Landsat 8 and Sentinel-2 satellite imagery to compute Surface Temperature and vegetation dynamics.',
    full_description: 'Built a geospatial analysis pipeline calculating Normalized Difference Vegetation Index (NDVI), Land Surface Temperature (LST), and Urban Heat Island (UHI) indices.',
    tags: ['Python', 'Google Earth Engine', 'Rasterio', 'GDAL', 'GeoPandas'],
    metrics: 'Processed 500km² multi-temporal satellite scenes in <3.5s',
    github_url: 'https://github.com/manishiitmandi',
    demo_url: '',
    featured: true,
    architecture: [
      'Multi-Band Optical & Thermal Raster Extraction',
      'Radiometric Calibration & Atmospheric Correction',
      'Split-Window Algorithm for LST Computation',
      'Spatial Temporal Zonal Statistics Generator',
    ],
  },
  {
    id: 'proj-4',
    title: 'Distributed Speech Lip-Sync & Multimodal Ingestion Pipeline',
    category: 'Generative AI',
    description: 'High-concurrency data engineering engine for multimodal speech alignment and lip-sync inference for video production.',
    full_description: 'Engineered high-throughput video processing pipelines at Zangoh, coordinating audio phoneme alignment, Wav2Lip visual synchrony, and cloud storage caching.',
    tags: ['Python', 'PyTorch', 'FFmpeg', 'Wav2Lip', 'FastAPI', 'Celery'],
    metrics: '4.2x processing throughput increase via worker parallelization',
    github_url: 'https://github.com/manishiitmandi',
    demo_url: '',
    featured: true,
    architecture: [
      'Phoneme Audio Feature Extraction & Alignment',
      'Facial Landmark & Visual Contour Tracking',
      'Generative Lip-Sync Synthesis Network',
      'Concurrent FFmpeg Multiplexing & CDN Storage',
    ],
  },
];

export const fallbackSkills: SkillCategory[] = [
  {
    category: 'Backend Architecture & Systems',
    description: 'High-throughput async APIs, database design, caching & microservices',
    skills: [
      { name: 'Python / FastAPI', level: 95, highlight: true },
      { name: 'PostgreSQL / Neon', level: 90, highlight: true },
      { name: 'SQLAlchemy & ORM', level: 90, highlight: true },
      { name: 'JWT & OAuth Security', level: 88, highlight: true },
      { name: 'Redis Caching', level: 82 },
      { name: 'Docker & Microservices', level: 85 },
    ],
  },
  {
    category: 'Applied AI & Deep Learning',
    description: 'Deep neural networks, Vision GNNs, cellular automata & agent pipelines',
    skills: [
      { name: 'PyTorch & Torchvision', level: 92, highlight: true },
      { name: 'Graph Neural Networks (GNN)', level: 88, highlight: true },
      { name: 'Computer Vision & OpenCV', level: 90, highlight: true },
      { name: 'Cellular Automata (NCA)', level: 86 },
      { name: 'Multimodal Generative AI', level: 88 },
      { name: 'Hugging Face & Transformers', level: 84 },
    ],
  },
  {
    category: 'Tooling, Cloud & Workflow',
    description: 'DevOps, version control, scientific libraries & cloud deployment',
    skills: [
      { name: 'Git & GitHub CI/CD', level: 92, highlight: true },
      { name: 'NumPy, Pandas & SciPy', level: 90 },
      { name: 'Linux / Shell Scripting', level: 88 },
      { name: 'Vercel & Render Cloud', level: 88 },
      { name: 'TypeScript & React', level: 82 },
    ],
  },
];

export const fallbackExperience: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Software Development & Generative AI Intern',
    company: 'Zangoh (Newzera Tech Labs)',
    location: 'Indore, India (Hybrid)',
    period: 'Dec 2024 - Feb 2025',
    type: 'Internship',
    highlights: [
      'Engineered core modules for speech lip-synchronization data processing pipelines using Python, PyTorch, and FFmpeg.',
      'Constructed distributed microservice APIs in FastAPI handling high-concurrency multimodal data ingestion with sub-100ms response targets.',
      'Automated video enhancement, frame alignment, and feature extraction workflows, reducing pipeline processing latency by 35%.',
    ],
    tech_stack: ['Python', 'FastAPI', 'PyTorch', 'FFmpeg', 'Docker', 'Git'],
    current: false,
  },
  {
    id: 'exp-2',
    role: 'Undergraduate Researcher — Deep Learning & Medical Vision',
    company: 'Indian Institute of Technology (IIT) Mandi',
    location: 'Himachal Pradesh, India',
    period: 'Aug 2024 - Present',
    type: 'Research',
    highlights: [
      'Investigating Graph Neural Network architectures (Vision GNN / ViG-UNet) and Neural Cellular Automata (NCA) for retinal vessel segmentation.',
      'Implemented custom graph convolution and dynamic message-passing layers for fine-grained morphological extraction on DRIVE and STARE datasets.',
      'Achieved a 0.84 Dice Score outperforming baseline UNet architectures under consistent cross-validation protocols.',
    ],
    tech_stack: ['PyTorch', 'Vision GNN', 'Cellular Automata', 'Computer Vision', 'NumPy'],
    current: true,
  },
];

export const fallbackEducation: EducationItem[] = [
  {
    id: 'edu-1',
    institution: 'Indian Institute of Technology (IIT) Mandi',
    degree: 'Bachelor of Technology (B.Tech) in Electrical Engineering',
    period: '2023 - 2027',
    location: 'Kamand, Himachal Pradesh, India',
    cgpa_or_grade: '8.07 / 10.0',
    coursework: [
      'Data Structures & Algorithms',
      'Machine Learning & Pattern Recognition',
      'Signals & Systems',
      'Computer Architecture & Microprocessors',
      'Probability, Random Processes & Statistics',
      'Linear Algebra & Numerical Methods',
    ],
    highlights: [
      'Class of 2027 • IIT Mandi',
      'Active contributor to Technical Society & AI Research initiatives',
    ],
  },
];
