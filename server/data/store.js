// In-Memory & Persistent Data Store for ProjectPartner
// Complete academic collaboration ecosystem with all modules
import bcrypt from 'bcryptjs';

const hash = (pass) => bcrypt.hashSync(pass, 10);

export const store = {
  users: [
    {
      id: 'u_student_1',
      email: 'student.demo@college.edu',
      passwordHash: hash('StudentPass123!'),
      role: 'student',
      fullName: 'Rahul Sharma',
      college: 'National Institute of Technology',
      department: 'Computer Science & Engineering',
      yearOfStudy: '3rd Year',
      skills: ['Python', 'React', 'MongoDB', 'Machine Learning', 'Node.js'],
      interests: ['Artificial Intelligence', 'Full-Stack Development'],
      bio: 'Enthusiastic CS student passionate about applied AI and full-stack web applications.',
      resumeName: 'Rahul_Sharma_CV.pdf',
      resumeUrl: 'data:application/pdf;base64,JVBERi0xLjQKJUZBS0VfUkVTVU1FX1JBSFVMX1NIQVJNQQ==',
      streakDays: 6,
      hoursSpent: 48,
      badges: ['🔥 6-Day Streak', '🚀 Project Pioneer', '🤝 Team Collaborator', '🎯 Skill Master'],
      githubUrl: 'https://github.com/rahul-sharma',
      linkedinUrl: 'https://linkedin.com/in/rahul-sharma',
      createdAt: new Date().toISOString()
    },
    {
      id: 'u_student_2',
      email: 'sneha.patel@college.edu',
      passwordHash: hash('StudentPass123!'),
      role: 'student',
      fullName: 'Sneha Patel',
      college: 'National Institute of Technology',
      department: 'Information Technology',
      yearOfStudy: '4th Year',
      skills: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'Docker'],
      interests: ['Cloud Architecture', 'DevOps'],
      bio: 'Final year IT undergraduate focused on building scalable microservices and clean user interfaces.',
      resumeName: 'Sneha_Patel_Resume_2026.pdf',
      resumeUrl: 'data:application/pdf;base64,JVBERi0xLjQKJUZBS0VfUkVTVU1FX1NORUhBX1BBVEVM',
      streakDays: 4,
      hoursSpent: 35,
      badges: ['🔥 4-Day Streak', '⚡ Rapid Prototyper', '🤝 Team Collaborator'],
      githubUrl: 'https://github.com/sneha-patel',
      linkedinUrl: 'https://linkedin.com/in/sneha-patel',
      createdAt: new Date().toISOString()
    },
    {
      id: 'u_student_3',
      email: 'aditya.verma@college.edu',
      passwordHash: hash('StudentPass123!'),
      role: 'student',
      fullName: 'Aditya Verma',
      college: 'National Institute of Technology',
      department: 'Electronics & Communication',
      yearOfStudy: '2nd Year',
      skills: ['Python', 'C++', 'OpenCV', 'PyTorch', 'IoT'],
      interests: ['Robotics', 'Embedded Systems', 'Computer Vision'],
      bio: 'ECE junior with hands-on experience in sensor integration and autonomous drone algorithms.',
      resumeName: 'Aditya_Verma_Robotics_CV.pdf',
      resumeUrl: 'data:application/pdf;base64,JVBERi0xLjQKJUZBS0VfUkVTVU1FX0FESVRZQV9WRVJNQQ==',
      streakDays: 9,
      hoursSpent: 62,
      badges: ['🔥 9-Day Streak', '🤖 Hardware Hacker', '📜 Certified Scholar', '🏆 Sprint Finisher'],
      githubUrl: 'https://github.com/aditya-verma',
      linkedinUrl: 'https://linkedin.com/in/aditya-verma',
      createdAt: new Date().toISOString()
    },
    {
      id: 'u_mentor_1',
      email: 'mentor.rajesh@college.edu',
      passwordHash: hash('MentorPass123!'),
      role: 'mentor',
      fullName: 'Dr. Rajesh Kumar',
      college: 'National Institute of Technology',
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor & AI Lab Lead',
      experienceYears: 12,
      expertise: ['Artificial Intelligence', 'Robotics', 'Computer Vision', 'Deep Learning'],
      bio: 'Leading research on autonomous systems and intelligent perception with over 30 published papers.',
      badges: ['🌟 Top Mentor', '🚀 Research Leader', '🤝 Co-Mentor Collaborator'],
      ratingAvg: 4.9,
      ratingsCount: 14,
      createdAt: new Date().toISOString()
    },
    {
      id: 'u_mentor_2',
      email: 'mentor.ananya@college.edu',
      passwordHash: hash('MentorPass123!'),
      role: 'mentor',
      fullName: 'Prof. Ananya Sen',
      college: 'National Institute of Technology',
      department: 'Information Technology',
      designation: 'Assistant Professor & Software Lead',
      experienceYears: 8,
      expertise: ['Full-Stack Web Development', 'Distributed Systems', 'Blockchain'],
      bio: 'Guiding student capstone projects in distributed systems, modern web architectures, and decentralization.',
      badges: ['🌟 Top Mentor', '💡 Code Architect', '🤝 Co-Mentor Collaborator'],
      ratingAvg: 4.8,
      ratingsCount: 11,
      createdAt: new Date().toISOString()
    },
    {
      id: 'u_admin_1',
      email: 'admin.lead@college.edu',
      passwordHash: hash('AdminPass123!'),
      role: 'admin',
      fullName: 'Dr. M. S. Swaminathan (Dean)',
      college: 'National Institute of Technology',
      department: 'Academic Affairs & Research Governance',
      designation: 'Dean of Research & Academic Governance',
      createdAt: new Date().toISOString()
    }
  ],

  projects: [
    {
      id: 'proj_1',
      mentorId: 'u_mentor_1',
      mentorName: 'Dr. Rajesh Kumar',
      mentorDept: 'CSE Dept',
      coMentors: [
        {
          mentorId: 'u_mentor_2',
          mentorName: 'Prof. Ananya Sen',
          mentorDept: 'IT Dept'
        }
      ],
      title: 'Autonomous Drone Navigation Using Computer Vision & Edge AI',
      problemStatement: 'Current search-and-rescue quadcopters struggle in GPS-denied environments. This project builds a lightweight onboard vision model that tracks obstacles and plans collision-free paths in real time.',
      domain: 'AI & Robotics',
      requiredSkills: ['Python', 'OpenCV', 'PyTorch', 'Machine Learning'],
      teamSizeRequired: 4,
      durationWeeks: 12,
      deadline: '2026-12-15',
      stipendAmount: '₹6,000 / Month (Research Grant Funded)',
      status: 'in_progress', // 'open' | 'in_progress' | 'completed'
      isCompleted: false,
      completedAt: null,
      checklist: [
        { id: 'chk_1', title: 'Hardware Frame Assembly & Jetson Nano Setup', description: 'Mount depth camera and configure JetPack Linux SDK.', assignedTo: 'u_student_3', assignedToName: 'Aditya Verma', completed: true, completedAt: '2026-11-05' },
        { id: 'chk_2', title: 'YOLOv8 Aerial Dataset Training & TensorRT', description: 'Train model on 10,000 aerial obstacle frames.', assignedTo: 'u_student_3', assignedToName: 'Aditya Verma', completed: true, completedAt: '2026-11-09' },
        { id: 'chk_3', title: 'ROS 2 Micro-Controller Serial Link', description: 'Integrate Pixhawk telemetry with onboard flight controller.', assignedTo: 'u_student_3', assignedToName: 'Aditya Verma', completed: false, completedAt: null },
        { id: 'chk_4', title: 'Real-Time Collision Avoidance Flight Test', description: 'Perform indoor obstacle avoidance demonstration and report benchmark latency under 15ms.', assignedTo: 'u_student_3', assignedToName: 'Aditya Verma', completed: false, completedAt: null }
      ],
      createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
    },
    {
      id: 'proj_2',
      mentorId: 'u_mentor_2',
      mentorName: 'Prof. Ananya Sen',
      mentorDept: 'IT Dept',
      coMentors: [],
      title: 'Decentralized Student Academic Credential Verification Portal',
      problemStatement: 'Forged degree certificates and slow manual verification processes hinder graduate hiring. We are creating a tamper-proof web application using cryptographic hashing and smart contracts.',
      domain: 'Full-Stack Web',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'Express'],
      teamSizeRequired: 3,
      durationWeeks: 10,
      deadline: '2026-11-30',
      stipendAmount: '₹5,000 / Month + Performance Bonus',
      status: 'open',
      isCompleted: false,
      completedAt: null,
      checklist: [
        { id: 'chk_201', title: 'Cryptographic Hashing Utility & Schema Design', description: 'SHA-256 document hashing and Mongoose models.', assignedTo: null, assignedToName: 'Unassigned', completed: true, completedAt: '2026-11-02' },
        { id: 'chk_202', title: 'Student & University Verification Portal UI', description: 'Responsive React verification desk with PDF preview.', assignedTo: null, assignedToName: 'Unassigned', completed: false, completedAt: null },
        { id: 'chk_203', title: 'Smart Contract Testnet Deployment', description: 'Deploy ledger contract on Sepolia testnet.', assignedTo: null, assignedToName: 'Unassigned', completed: false, completedAt: null }
      ],
      createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString()
    },
    {
      id: 'proj_3',
      mentorId: 'u_mentor_1',
      mentorName: 'Dr. Rajesh Kumar',
      mentorDept: 'CSE Dept',
      coMentors: [],
      title: 'Smart Campus Energy & Climate Monitoring Sensor Grid',
      problemStatement: 'Inefficient HVAC and lighting consume excessive campus power. We deploy wireless IoT nodes and stream time-series sensor telemetry to an analytics dashboard for automated conservation.',
      domain: 'IoT & Cloud',
      requiredSkills: ['Python', 'C++', 'IoT', 'MongoDB', 'React'],
      teamSizeRequired: 3,
      durationWeeks: 8,
      deadline: '2026-12-01',
      stipendAmount: '₹4,500 / Month',
      status: 'open',
      isCompleted: false,
      completedAt: null,
      checklist: [
        { id: 'chk_301', title: 'Sensor Mesh Network Calibration (ESP32)', description: 'Calibrate DHT22 and power consumption current sensors.', assignedTo: null, assignedToName: 'Unassigned', completed: true, completedAt: '2026-11-01' },
        { id: 'chk_302', title: 'MQTT Telemetry Broker & Data Pipeline', description: 'Stream temperature/voltage packets to backend database.', assignedTo: null, assignedToName: 'Unassigned', completed: false, completedAt: null },
        { id: 'chk_303', title: 'Live Energy Conservation Dashboard', description: 'Visual charts with anomaly alerts.', assignedTo: null, assignedToName: 'Unassigned', completed: false, completedAt: null }
      ],
      createdAt: new Date(Date.now() - 3600000 * 24 * 9).toISOString()
    },
    {
      id: 'proj_4',
      mentorId: 'u_mentor_2',
      mentorName: 'Prof. Ananya Sen',
      mentorDept: 'IT Dept',
      coMentors: [],
      title: 'AI-Powered Collaborative Code Review & Bug Diagnostic Assistant',
      problemStatement: 'Student software teams face difficulties identifying subtle logic flaws and security vulnerabilities before submission. We are constructing an automated code analyzer integrated with GitHub webhooks.',
      domain: 'Full-Stack Web',
      requiredSkills: ['Python', 'React', 'Node.js', 'Docker', 'Machine Learning'],
      teamSizeRequired: 4,
      durationWeeks: 14,
      deadline: '2026-12-20',
      stipendAmount: 'Academic Research Honors + ₹5,000 Award',
      status: 'open',
      isCompleted: false,
      completedAt: null,
      checklist: [
        { id: 'chk_401', title: 'AST Parser & Static Analysis Engine', description: 'Detect common anti-patterns in JavaScript & Python.', assignedTo: null, assignedToName: 'Unassigned', completed: true, completedAt: '2026-11-04' },
        { id: 'chk_402', title: 'GitHub PR Webhook Integration', description: 'Automatically comment lint and security issues on pull requests.', assignedTo: null, assignedToName: 'Unassigned', completed: false, completedAt: null }
      ],
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
    }
  ],

  // Student-Led Independent Projects (Students team up without mentors or can invite mentors)
  independentProjects: [
    {
      id: 'indep_1',
      creatorId: 'u_student_1',
      creatorName: 'Rahul Sharma',
      creatorDept: 'CSE Dept, 3rd Year',
      title: 'DevCollab: Real-Time Pair Programming Web IDE with WebRTC',
      problemStatement: 'Students during hackathons need to write code together with voice chat and live cursor synchronization without cumbersome setup. We are building a browser-based shared coding canvas.',
      domain: 'Full-Stack Web',
      requiredSkills: ['React', 'Node.js', 'WebSockets', 'WebRTC'],
      teamSize: 3,
      currentMembers: [
        {
          studentId: 'u_student_1',
          name: 'Rahul Sharma',
          dept: 'CSE Dept, 3rd Year',
          role: 'Project Head & Full-Stack Lead',
          currentTask: 'WebRTC Peer Connection Setup'
        },
        {
          studentId: 'u_student_2',
          name: 'Sneha Patel',
          dept: 'IT Dept, 4th Year',
          role: 'Frontend UI Lead',
          currentTask: 'Monaco Editor Integration'
        }
      ],
      invitedMentors: [
        {
          mentorId: 'u_mentor_2',
          mentorName: 'Prof. Ananya Sen',
          status: 'accepted',
          remarks: 'Happy to advise your team on WebRTC scaling!'
        }
      ],
      status: 'open',
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
    },
    {
      id: 'indep_2',
      creatorId: 'u_student_3',
      creatorName: 'Aditya Verma',
      creatorDept: 'ECE Dept, 2nd Year',
      title: 'Smart Waste Sorting Bin with Computer Vision & Edge AI',
      problemStatement: 'Campus recycling bins are often contaminated because people mix compostable and plastic waste. We are building a camera-equipped smart bin that automatically recognizes and classifies discarded items.',
      domain: 'IoT & AI',
      requiredSkills: ['Python', 'OpenCV', 'Raspberry Pi', 'TensorFlow'],
      teamSize: 3,
      currentMembers: [
        {
          studentId: 'u_student_3',
          name: 'Aditya Verma',
          dept: 'ECE Dept, 2nd Year',
          role: 'Hardware & Camera Lead',
          currentTask: 'Raspberry Pi Servo Motor Control'
        }
      ],
      invitedMentors: [
        {
          mentorId: 'u_mentor_1',
          mentorName: 'Dr. Rajesh Kumar',
          mentorDept: 'CSE Dept',
          mentorDesignation: 'Associate Professor & AI Lab Lead',
          status: 'pending',
          remarks: 'Dear Dr. Rajesh, we would be honored if you could advise our edge vision smart bin project!',
          invitedAt: new Date(Date.now() - 3600000 * 12).toISOString()
        }
      ],
      status: 'open',
      createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString()
    }
  ],

  // Student Community Hub: Campus Idea Lounge & Discussion Feed
  communityPosts: [
    {
      id: 'post_1',
      authorId: 'u_student_1',
      authorName: 'Rahul Sharma',
      authorRole: 'student',
      authorDept: 'CSE Dept, 3rd Year',
      title: '💡 Idea Pitch: AI-Powered Campus Notes Sharing & Audio Flashcards',
      content: 'I noticed students struggle to digest 50-page professor slides before semester exams. What if we build an open-source tool that converts PDF lecture notes into 2-minute audio summaries and active recall flashcards? Looking for 1 backend developer and 1 ML engineer to team up for the upcoming Smart India Hackathon!',
      tags: ['Hackathon', 'AI/ML', 'Teammates Wanted', 'EdTech'],
      upvotes: 24,
      comments: [
        {
          id: 'c_1',
          authorName: 'Sneha Patel',
          authorRole: 'student',
          text: 'Love this idea! I have experience with Whisper speech models and React. Count me in!',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          id: 'c_2',
          authorName: 'Dr. Rajesh Kumar',
          authorRole: 'mentor',
          text: 'Great initiative Rahul. If you structure the pipeline using semantic chunking, I would be glad to support this project from the AI Lab.',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
    },
    {
      id: 'post_2',
      authorId: 'u_student_3',
      authorName: 'Aditya Verma',
      authorRole: 'student',
      authorDept: 'ECE Dept, 2nd Year',
      title: '🤖 Robotics Workshop: Getting started with ROS 2 and Jetson Nano',
      content: 'Hey everyone! If anyone wants to learn how to interface ROS 2 with depth cameras on embedded hardware, check out my starter GitHub repo or drop your questions here. Let us collaborate on autonomous navigation projects!',
      tags: ['Robotics', 'ROS2', 'OpenSource', 'Hardware'],
      upvotes: 31,
      comments: [
        {
          id: 'c_3',
          authorName: 'Rahul Sharma',
          authorRole: 'student',
          text: 'Awesome repo Aditya! Starred and looking forward to the lab demo on Friday.',
          createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 30).toISOString()
    }
  ],

  // Student Applications for Mentor Projects
  applications: [
    {
      id: 'app_1',
      projectId: 'proj_1',
      studentId: 'u_student_3',
      studentName: 'Aditya Verma',
      studentEmail: 'aditya.verma@college.edu',
      studentDept: 'ECE Dept, 2nd Year',
      studentSkills: ['Python', 'C++', 'OpenCV', 'PyTorch', 'IoT'],
      resumeName: 'Aditya_Verma_Robotics_CV.pdf',
      resumeUrl: 'data:application/pdf;base64,JVBERi0xLjQKJUZBS0VfUkVTVU1FX0FESVRZQV9WRVJNQQ==',
      coverNote: 'I have built ROS simulations for quadrotors and worked on edge vision with OpenCV. I would love to contribute to the obstacle detection pipeline.',
      status: 'accepted',
      appliedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
      reviewedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
    },
    {
      id: 'app_2',
      projectId: 'proj_2',
      studentId: 'u_student_1',
      studentName: 'Rahul Sharma',
      studentEmail: 'student.demo@college.edu',
      studentDept: 'CSE Dept, 3rd Year',
      studentSkills: ['Python', 'React', 'MongoDB', 'Machine Learning', 'Node.js'],
      resumeName: 'Rahul_Sharma_CV.pdf',
      resumeUrl: 'data:application/pdf;base64,JVBERi0xLjQKJUZBS0VfUkVTVU1FX1JBSFVMX1NIQVJNQQ==',
      coverNote: 'I have built REST APIs with Express and MongoDB, and crafted responsive frontends in React. Excited to work on student credential verification.',
      status: 'accepted',
      appliedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
      reviewedAt: new Date(Date.now() - 3600000 * 10).toISOString()
    },
    {
      id: 'app_3',
      projectId: 'proj_1',
      studentId: 'u_student_2',
      studentName: 'Sneha Patel',
      studentEmail: 'sneha.patel@college.edu',
      studentDept: 'IT Dept, 4th Year',
      studentSkills: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'Docker'],
      resumeName: 'Sneha_Patel_Resume_2026.pdf',
      resumeUrl: 'data:application/pdf;base64,JVBERi0xLjQKJUZBS0VfUkVTVU1FX1NORUhBX1BBVEVM',
      coverNote: 'I can build the telemetry dashboard and Docker containerization pipeline for the ground station interface.',
      status: 'pending',
      appliedAt: new Date(Date.now() - 3600000 * 8).toISOString()
    }
  ],

  // Formed Project Teams
  teams: [
    {
      id: 'team_proj_1',
      projectId: 'proj_1',
      projectTitle: 'Autonomous Drone Navigation Using Computer Vision & Edge AI',
      mentorId: 'u_mentor_1',
      mentorName: 'Dr. Rajesh Kumar',
      coMentorName: 'Prof. Ananya Sen',
      members: [
        {
          studentId: 'u_student_3',
          name: 'Aditya Verma',
          email: 'aditya.verma@college.edu',
          dept: 'ECE Dept, 2nd Year',
          role: 'Computer Vision & Hardware Lead',
          currentTask: 'ROS 2 Flight Controller Serial Link',
          isActive: true,
          hoursLogged: 62,
          joinedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
    },
    {
      id: 'team_proj_2',
      projectId: 'proj_2',
      projectTitle: 'Decentralized Student Academic Credential Verification Portal',
      mentorId: 'u_mentor_2',
      mentorName: 'Prof. Ananya Sen',
      coMentorName: null,
      members: [
        {
          studentId: 'u_student_1',
          name: 'Rahul Sharma',
          email: 'student.demo@college.edu',
          dept: 'CSE Dept, 3rd Year',
          role: 'Full-Stack Developer & Smart Contract Lead',
          currentTask: 'REST APIs & JWT Middleware for Campus Verification',
          isActive: true,
          hoursLogged: 48,
          joinedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
        },
        {
          studentId: 'u_student_2',
          name: 'Sneha Patel',
          email: 'sneha.patel@college.edu',
          dept: 'IT Dept, 4th Year',
          role: 'Frontend UI Lead',
          currentTask: 'React Certificate Viewer & Modal Design',
          isActive: true,
          hoursLogged: 36,
          joinedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
    }
  ],

  // Certificates Issued to Teammates
  certificates: [
    {
      id: 'cert_1',
      certId: 'PP-CERT-2026-NIT-8491',
      studentId: 'u_student_3',
      studentName: 'Aditya Verma',
      projectId: 'proj_1',
      projectTitle: 'Autonomous Drone Navigation Using Computer Vision & Edge AI',
      mentorName: 'Dr. Rajesh Kumar',
      mentorDesignation: 'Associate Professor & AI Lab Lead',
      institution: 'National Institute of Technology',
      grade: 'Distinction (A+)',
      issueDate: '2026-11-10',
      stipendDisbursed: '₹18,000 Total Research Grant',
      verificationUrl: 'https://projectpartner.college.edu/verify/PP-CERT-2026-NIT-8491'
    }
  ],

  // Two-Way Feedback & Rating System
  feedback: [
    {
      id: 'fb_1',
      projectId: 'proj_1',
      projectTitle: 'Autonomous Drone Navigation Using Computer Vision & Edge AI',
      fromUserId: 'u_student_3',
      fromUserName: 'Aditya Verma',
      fromRole: 'student',
      toUserId: 'u_mentor_1',
      toUserName: 'Dr. Rajesh Kumar',
      toRole: 'mentor',
      rating: 5,
      reviewText: 'Dr. Rajesh Kumar provided incredible technical guidance on Jetson Nano edge acceleration and flight control algorithms. One of the best mentors I have learned from!',
      createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString()
    },
    {
      id: 'fb_2',
      projectId: 'proj_1',
      projectTitle: 'Autonomous Drone Navigation Using Computer Vision & Edge AI',
      fromUserId: 'u_mentor_1',
      fromUserName: 'Dr. Rajesh Kumar',
      fromRole: 'mentor',
      toUserId: 'u_student_3',
      toUserName: 'Aditya Verma',
      toRole: 'student',
      rating: 5,
      reviewText: 'Aditya demonstrated exceptional tenacity in hardware assembly, ROS 2 messaging, and model quantization. Ready for senior capstone research.',
      createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString()
    }
  ],

  // Peer Reporting & Moderation
  reports: [
    {
      id: 'rep_1',
      reporterId: 'u_student_1',
      reporterName: 'Rahul Sharma',
      reportedUserId: 'u_student_4_dummy',
      reportedUserName: 'Dummy Inactive User',
      projectId: 'proj_2',
      reason: 'Inactivity on Assigned Tasks',
      details: 'Member did not attend scheduled sprint check-ins for 2 weeks.',
      status: 'resolved',
      createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString()
    }
  ],

  // Dual-Tab Team Chat & Co-Mentor Channels
  messages: [
    {
      id: 'msg_1',
      projectId: 'proj_1',
      channel: 'peer', // 'peer' (students only)
      senderId: 'u_student_3',
      senderName: 'Aditya Verma',
      senderRole: 'student',
      text: 'Hey teammates! I pushed the YOLOv8 dataset script to our shared repo branch. Let me know if you can run the camera inference test.',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'msg_2',
      projectId: 'proj_1',
      channel: 'mentor', // 'mentor' (team + mentor guidance)
      senderId: 'u_mentor_1',
      senderName: 'Dr. Rajesh Kumar',
      senderRole: 'mentor',
      text: 'Team, please ensure your first milestone documentation includes frame-rate latency measurements under 15ms.',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'msg_3',
      projectId: 'proj_1',
      channel: 'mentor',
      senderId: 'u_student_3',
      senderName: 'Aditya Verma',
      senderRole: 'student',
      text: 'Understood Dr. Kumar! We are running TensorRT optimizations to keep latency below 12ms on the Jetson Nano.',
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
    },
    {
      id: 'msg_4',
      projectId: 'proj_1',
      channel: 'co_mentor', // Private channel between co-mentors
      senderId: 'u_mentor_1',
      senderName: 'Dr. Rajesh Kumar',
      senderRole: 'mentor',
      text: 'Prof. Ananya, Aditya is making great progress on the vision pipeline. Can your team assist him with the telemetry web UI next week?',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: 'msg_5',
      projectId: 'proj_1',
      channel: 'co_mentor',
      senderId: 'u_mentor_2',
      senderName: 'Prof. Ananya Sen',
      senderRole: 'mentor',
      text: 'Absolutely Dr. Rajesh! I will assign Sneha to coordinate with Aditya on the WebSocket telemetry dashboard.',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'msg_6',
      projectId: 'proj_2',
      channel: 'peer',
      senderId: 'u_student_1',
      senderName: 'Rahul Sharma',
      senderRole: 'student',
      text: 'Hey Sneha! I just finished wiring the JWT token verification for degree cert lookups. Check out the backend branch!',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: 'msg_7',
      projectId: 'proj_2',
      channel: 'peer',
      senderId: 'u_student_2',
      senderName: 'Sneha Patel',
      senderRole: 'student',
      text: 'Nice work Rahul! The modal UI is ready to bind with your verification endpoint. Testing now.',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'msg_8',
      projectId: 'proj_2',
      channel: 'mentor',
      senderId: 'u_mentor_2',
      senderName: 'Prof. Ananya Sen',
      senderRole: 'mentor',
      text: 'Great initiative team! Let us ensure we follow cryptographic hash integrity for the tamper-proof credential records.',
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
    }
  ]
};

// Skill Match Calculator Helper
export function calculateSkillMatch(studentSkills = [], projectSkills = []) {
  if (!projectSkills || projectSkills.length === 0) return 0;
  
  const normStudent = studentSkills.map(s => s.toLowerCase().trim());
  const normProject = projectSkills.map(s => s.toLowerCase().trim());
  
  const matched = normProject.filter(s => normStudent.includes(s));
  const score = Math.round((matched.length / normProject.length) * 100);
  return score;
}
