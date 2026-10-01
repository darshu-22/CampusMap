import type { Building, Floor, Room, Facility, DirectoryItem, SearchResult } from '../types';

export const buildings: Building[] = [
  {
    id: 'academic-block',
    name: 'Academic Block',
    description: 'The main academic building hosting engineering, biotechnology, science and humanities departments across six floors.',
    floorsCount: 6,
    floors: ['ground', 'floor-1', 'floor-2', 'floor-3', 'floor-4', 'floor-5'],
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'administration-block',
    name: 'Administration Building',
    description: 'Houses core administrative offices, including Admissions, Accounts, Principal\'s Office, and the Counselling cell.',
    floorsCount: 2,
    floors: ['admin-ground', 'admin-first'],
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'central-annex',
    name: 'Central Annex & Library',
    description: 'A multi-story facility housing the Central Library, Placement Cell, and the main Center of Excellence.',
    floorsCount: 3,
    floors: ['annex-ground', 'annex-first', 'annex-second'],
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80'
  }
];

export const floors: Floor[] = [
  // Academic Block Floors
  {
    id: 'ground',
    buildingId: 'academic-block',
    number: 0,
    name: 'Ground Floor',
    department: 'Computer Science & Engineering',
    roomsCount: 12,
    labsCount: 4,
    rooms: ['cse-office', 'cse-lab-1', 'cse-lab-2', 'cse-seminar-hall', 'classroom-01', 'classroom-02'],
    washrooms: 'Opposite to Lift A (Left wing)',
    lifts: ['Lift A', 'Lift B'],
    emergencyExit: 'North-East Exit Gate and South Exit Gate',
    staircases: 'Central Stairs and West Wing Staircase'
  },
  {
    id: 'floor-1',
    buildingId: 'academic-block',
    number: 1,
    name: 'First Floor',
    department: 'Electronics & Communication Engineering',
    roomsCount: 10,
    labsCount: 3,
    rooms: ['ece-office', 'ece-lab-1', 'ece-lab-2', 'classroom-103', 'classroom-104'],
    washrooms: 'Beside West Wing Staircase',
    lifts: ['Lift A', 'Lift B'],
    emergencyExit: 'Emergency staircase located at West Wing',
    staircases: 'Central Stairs and West Wing Staircase'
  },
  {
    id: 'floor-2',
    buildingId: 'academic-block',
    number: 2,
    name: 'Second Floor',
    department: 'Mechanical Engineering',
    roomsCount: 9,
    labsCount: 3,
    rooms: ['me-office', 'me-lab-1', 'me-lab-2', 'classroom-203', 'classroom-204'],
    washrooms: 'Beside Lift B (Right wing)',
    lifts: ['Lift A', 'Lift B'],
    emergencyExit: 'Emergency spiral staircase at North end',
    staircases: 'Central Stairs and West Wing Staircase'
  },
  {
    id: 'floor-3',
    buildingId: 'academic-block',
    number: 3,
    name: 'Third Floor',
    department: 'Civil Engineering',
    roomsCount: 11,
    labsCount: 2,
    rooms: ['civil-office', 'civil-lab-1', 'nsoj-room', 'classroom-303', 'classroom-304'],
    washrooms: 'Opposite to Lift A (Left wing)',
    lifts: ['Lift A', 'Lift B'],
    emergencyExit: 'Emergency door connecting to West Wing external ramp',
    staircases: 'Central Stairs and West Wing Staircase'
  },
  {
    id: 'floor-4',
    buildingId: 'academic-block',
    number: 4,
    name: 'Fourth Floor',
    department: 'Biotechnology',
    roomsCount: 8,
    labsCount: 4,
    rooms: ['biotech-office', 'biotech-lab-1', 'biotech-lab-2', 'classroom-403', 'classroom-404'],
    washrooms: 'Beside West Wing Staircase',
    lifts: ['Lift A', 'Lift B'],
    emergencyExit: 'Emergency staircase located at West Wing',
    staircases: 'Central Stairs and West Wing Staircase'
  },
  {
    id: 'floor-5',
    buildingId: 'academic-block',
    number: 5,
    name: 'Fifth Floor',
    department: 'Management Studies & Humanities',
    roomsCount: 7,
    labsCount: 1,
    rooms: ['mba-office', 'mba-seminar-hall', 'classroom-502', 'classroom-503'],
    washrooms: 'Beside Lift B (Right wing)',
    lifts: ['Lift A', 'Lift B'],
    emergencyExit: 'Roof Access Door and West Wing Emergency Stairs',
    staircases: 'Central Stairs and West Wing Staircase'
  },

  // Admin Block Floors
  {
    id: 'admin-ground',
    buildingId: 'administration-block',
    number: 0,
    name: 'Ground Floor',
    department: 'Central Administration',
    roomsCount: 5,
    labsCount: 0,
    rooms: ['admission-office', 'accounts-office', 'security-office-room', 'medical-room-office'],
    washrooms: 'Behind Reception Desk',
    lifts: ['Admin Lift'],
    emergencyExit: 'Main Glass Double Doors and Rear Staff Exit',
    staircases: 'Main Lobby Staircase'
  },
  {
    id: 'admin-first',
    buildingId: 'administration-block',
    number: 1,
    name: 'First Floor',
    department: 'Executive Offices',
    roomsCount: 4,
    labsCount: 0,
    rooms: ['principal-office-room', 'counselling-office-room'],
    washrooms: 'Beside Admin Lift lobby',
    lifts: ['Admin Lift'],
    emergencyExit: 'Fire escape ladder at the east end balcony',
    staircases: 'Main Lobby Staircase'
  },

  // Central Annex Floors
  {
    id: 'annex-ground',
    buildingId: 'central-annex',
    number: 0,
    name: 'Ground Floor',
    department: 'Facilities & Food Court',
    roomsCount: 3,
    labsCount: 0,
    rooms: ['canteen-room'],
    washrooms: 'Behind the main dining hall',
    lifts: ['Annex Lift'],
    emergencyExit: 'Double fire doors in the Canteen seating area',
    staircases: 'Annex Main Staircase'
  },
  {
    id: 'annex-first',
    buildingId: 'central-annex',
    number: 1,
    name: 'First Floor',
    department: 'Library & Placement Cell',
    roomsCount: 4,
    labsCount: 1,
    rooms: ['library-room', 'placement-cell-room'],
    washrooms: 'Adjacent to Library entrance lobby',
    lifts: ['Annex Lift'],
    emergencyExit: 'Rear Exit door to external steel stairs',
    staircases: 'Annex Main Staircase and Rear Spiral Exit Stairs'
  },
  {
    id: 'annex-second',
    buildingId: 'central-annex',
    number: 2,
    name: 'Second Floor',
    department: 'Research & Center of Excellence',
    roomsCount: 3,
    labsCount: 2,
    rooms: ['coe-room'],
    washrooms: 'Beside Annex Lift lobby',
    lifts: ['Annex Lift'],
    emergencyExit: 'Rear Exit door to external steel stairs',
    staircases: 'Annex Main Staircase'
  }
];

export const rooms: Room[] = [
  // CSE Rooms (Academic Block - Ground Floor)
  {
    id: 'cse-office',
    number: '001',
    name: 'Computer Science Department Office',
    buildingId: 'academic-block',
    floorId: 'ground',
    category: 'Office',
    department: 'Computer Science & Engineering',
    purpose: 'Handles academic queries, student registrations, and administrative tasks for the CSE department.',
    capacity: 15,
    nearbyRooms: ['Data Structures Lab (002)', 'CSE Seminar Hall (003)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Opposite to Lift A (Left wing)',
    directions: ['Main Gate', 'Academic Block Ground Floor Entrance', 'Turn Left at the Reception Desk', 'Walk straight past Lift A', 'Room 001 is on the right']
  },
  {
    id: 'cse-lab-1',
    number: '002',
    name: 'Data Structures & Algorithms Lab',
    buildingId: 'academic-block',
    floorId: 'ground',
    category: 'Lab',
    department: 'Computer Science & Engineering',
    purpose: 'Equipped with 60 high-performance workstations for programming sessions in C/C++, Java, and Python.',
    capacity: 60,
    nearbyRooms: ['CSE Department Office (001)', 'CSE Seminar Hall (003)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Opposite to Lift A (Left wing)',
    directions: ['Main Gate', 'Academic Block Ground Floor Entrance', 'Turn Left', 'Walk past Lift A', 'Room 002 is the second door on the right']
  },
  {
    id: 'cse-lab-2',
    number: '005',
    name: 'Database Management Systems Lab',
    buildingId: 'academic-block',
    floorId: 'ground',
    category: 'Lab',
    department: 'Computer Science & Engineering',
    purpose: 'Dedicated lab environment for hosting SQL, Database Security, and cloud database system experiments.',
    capacity: 45,
    nearbyRooms: ['Classroom 01 (006)', 'Classroom 02 (007)'],
    nearestLift: 'Lift B',
    nearestWashroom: 'Opposite to Lift B (Right wing)',
    directions: ['Main Gate', 'Academic Block Ground Floor Entrance', 'Turn Right', 'Walk straight for 30 meters', 'DBMS Lab (Room 005) is on your left']
  },
  {
    id: 'cse-seminar-hall',
    number: '003',
    name: 'CSE Seminar Hall',
    buildingId: 'academic-block',
    floorId: 'ground',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    purpose: 'Auditorium-style classroom hosting guest lectures, student seminars, and major department events.',
    capacity: 120,
    nearbyRooms: ['CSE Department Office (001)', 'Data Structures Lab (002)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Opposite to Lift A (Left wing)',
    directions: ['Main Gate', 'Academic Block Ground Floor Entrance', 'Turn Left', 'Room 003 is the double-door hall on your left before Lift A']
  },
  {
    id: 'classroom-01',
    number: '006',
    name: 'Classroom 01',
    buildingId: 'academic-block',
    floorId: 'ground',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    purpose: 'Lectures and tutorials for CSE second-year students.',
    capacity: 60,
    nearbyRooms: ['DBMS Lab (005)', 'Classroom 02 (007)'],
    nearestLift: 'Lift B',
    nearestWashroom: 'Opposite to Lift B (Right wing)',
    directions: ['Main Gate', 'Academic Block Ground Floor Entrance', 'Turn Right', 'Pass Lift B', 'Room 006 is the first door on the right']
  },
  {
    id: 'classroom-02',
    number: '007',
    name: 'Classroom 02',
    buildingId: 'academic-block',
    floorId: 'ground',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    purpose: 'Lectures and tutorials for CSE third-year students.',
    capacity: 60,
    nearbyRooms: ['Classroom 01 (006)', 'DBMS Lab (005)'],
    nearestLift: 'Lift B',
    nearestWashroom: 'Opposite to Lift B (Right wing)',
    directions: ['Main Gate', 'Academic Block Ground Floor Entrance', 'Turn Right', 'Pass Lift B', 'Room 007 is the second door on the right']
  },

  // ECE Rooms (Academic Block - First Floor)
  {
    id: 'ece-office',
    number: '101',
    name: 'ECE Department Office & HOD Cabin',
    buildingId: 'academic-block',
    floorId: 'floor-1',
    category: 'Faculty Room',
    department: 'Electronics & Communication Engineering',
    purpose: 'Office of the Head of Department and faculty support desks for ECE.',
    capacity: 10,
    nearbyRooms: ['Analog Electronics Lab (102)', 'ECE Lab 2 (105)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Beside West Wing Staircase',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift A to 1st Floor', 'Exit Lift A and turn left', 'Walk past the foyer', 'Room 101 is straight ahead']
  },
  {
    id: 'ece-lab-1',
    number: '102',
    name: 'Analog Electronics & VLSI Lab',
    buildingId: 'academic-block',
    floorId: 'floor-1',
    category: 'Lab',
    department: 'Electronics & Communication Engineering',
    purpose: 'Lab classes in breadboard prototyping, circuit design, oscilloscopes, and VLSI layout design.',
    capacity: 50,
    nearbyRooms: ['ECE Department Office (101)', 'Classroom 103 (103)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Beside West Wing Staircase',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift A to 1st Floor', 'Exit Lift A and turn left', 'Room 102 is the second room on the left']
  },
  {
    id: 'ece-lab-2',
    number: '105',
    name: 'Microcontrollers & IoT Lab',
    buildingId: 'academic-block',
    floorId: 'floor-1',
    category: 'Lab',
    department: 'Electronics & Communication Engineering',
    purpose: 'Hands-on training center for Arduino, Raspberry Pi, ESP32, and digital system designing.',
    capacity: 45,
    nearbyRooms: ['Classroom 104 (104)', 'ECE Office (101)'],
    nearestLift: 'Lift B',
    nearestWashroom: 'Beside West Wing Staircase',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift B to 1st Floor', 'Exit Lift and turn right', 'Walk 20 meters, Room 105 is on the right']
  },
  {
    id: 'classroom-103',
    number: '103',
    name: 'ECE Lecture Room 103',
    buildingId: 'academic-block',
    floorId: 'floor-1',
    category: 'Classroom',
    department: 'Electronics & Communication Engineering',
    purpose: 'Regular smart-classroom for ECE third-year lectures.',
    capacity: 65,
    nearbyRooms: ['Analog Electronics Lab (102)', 'Classroom 104 (104)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Beside West Wing Staircase',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift A to 1st Floor', 'Exit Lift A and turn left', 'Walk past Room 102', 'Room 103 is on the left']
  },
  {
    id: 'classroom-104',
    number: '104',
    name: 'ECE Lecture Room 104',
    buildingId: 'academic-block',
    floorId: 'floor-1',
    category: 'Classroom',
    department: 'Electronics & Communication Engineering',
    purpose: 'Regular smart-classroom for ECE final-year lectures.',
    capacity: 65,
    nearbyRooms: ['Classroom 103 (103)', 'Microcontrollers Lab (105)'],
    nearestLift: 'Lift B',
    nearestWashroom: 'Beside West Wing Staircase',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift B to 1st Floor', 'Exit Lift and turn right', 'Room 104 is on the left']
  },

  // ME Rooms (Academic Block - Second Floor)
  {
    id: 'me-office',
    number: '201',
    name: 'Mechanical HOD & Faculty Wing',
    buildingId: 'academic-block',
    floorId: 'floor-2',
    category: 'Faculty Room',
    department: 'Mechanical Engineering',
    purpose: 'Faculty cabins and academic counselling offices for ME students.',
    capacity: 12,
    nearbyRooms: ['CAD/CAM Designing Lab (202)', 'Classroom 203 (203)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Beside Lift B (Right wing)',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift A or B to 2nd Floor', 'From Lift A, turn left', 'Walk down the hallway to Room 201 on the right']
  },
  {
    id: 'me-lab-1',
    number: '202',
    name: 'CAD/CAM Designing Lab',
    buildingId: 'academic-block',
    floorId: 'floor-2',
    category: 'Lab',
    department: 'Mechanical Engineering',
    purpose: 'Computer aided design and modeling lab equipped with ANSYS, SolidWorks, and AutoCAD.',
    capacity: 40,
    nearbyRooms: ['Mechanical Faculty Wing (201)', 'Fluid Dynamics Lab (205)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Beside Lift B (Right wing)',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift A to 2nd Floor', 'Turn Left, Room 202 is the first door on the left']
  },
  {
    id: 'me-lab-2',
    number: '205',
    name: 'Fluid Dynamics & Thermal Lab',
    buildingId: 'academic-block',
    floorId: 'floor-2',
    category: 'Lab',
    department: 'Mechanical Engineering',
    purpose: 'Practical setups for hydraulic pumps, turbines, heat exchangers and thermal conductivity measurement.',
    capacity: 35,
    nearbyRooms: ['Classroom 204 (204)', 'CAD/CAM Designing Lab (202)'],
    nearestLift: 'Lift B',
    nearestWashroom: 'Beside Lift B (Right wing)',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift B to 2nd Floor', 'Exit Lift B, turn right', 'Fluid Dynamics Lab is the big glass doors on your right']
  },
  {
    id: 'classroom-203',
    number: '203',
    name: 'ME Classroom 203',
    buildingId: 'academic-block',
    floorId: 'floor-2',
    category: 'Classroom',
    department: 'Mechanical Engineering',
    purpose: 'Core classroom for Mechanical second year theory classes.',
    capacity: 60,
    nearbyRooms: ['CAD/CAM Designing Lab (202)', 'Classroom 204 (204)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Beside Lift B (Right wing)',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift A to 2nd Floor', 'Turn Left', 'Walk past Room 202', 'Room 203 is on the left']
  },
  {
    id: 'classroom-204',
    number: '204',
    name: 'ME Classroom 204',
    buildingId: 'academic-block',
    floorId: 'floor-2',
    category: 'Classroom',
    department: 'Mechanical Engineering',
    purpose: 'Core classroom for Mechanical third year theory classes.',
    capacity: 60,
    nearbyRooms: ['Classroom 203 (203)', 'Fluid Dynamics Lab (205)'],
    nearestLift: 'Lift B',
    nearestWashroom: 'Beside Lift B (Right wing)',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift B to 2nd Floor', 'Turn Right', 'Room 204 is on the left']
  },

  // Civil Rooms (Academic Block - Third Floor)
  {
    id: 'civil-office',
    number: '301',
    name: 'Civil Engineering Department Office',
    buildingId: 'academic-block',
    floorId: 'floor-3',
    category: 'Office',
    department: 'Civil Engineering',
    purpose: 'Administrative office for the Department of Civil Engineering.',
    capacity: 8,
    nearbyRooms: ['Geotechnical & Concrete Lab (305)', 'NSOJ Room (302)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Opposite to Lift A (Left wing)',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift A to 3rd Floor', 'Exit Lift A and turn left', 'Department Office (Room 301) is immediately on the left']
  },
  {
    id: 'nsoj-room',
    number: '302',
    name: 'NSOJ Room',
    buildingId: 'academic-block',
    floorId: 'floor-3',
    category: 'Classroom',
    department: 'Civil Engineering',
    purpose: 'A specialized smart seminar room sponsored by National School of Journalism & Social Science for cross-department debates, humanities classes and media studies.',
    capacity: 50,
    nearbyRooms: ['Civil Department Office (301)', 'Classroom 303 (303)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Opposite to Lift A (Left wing)',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift A to 3rd Floor', 'Exit Lift A and turn left', 'Walk past Room 301', 'NSOJ Room (Room 302) is on the right']
  },
  {
    id: 'classroom-303',
    number: '303',
    name: 'Civil Classroom 303',
    buildingId: 'academic-block',
    floorId: 'floor-3',
    category: 'Classroom',
    department: 'Civil Engineering',
    purpose: 'Lectures and tutorials on Structural Engineering, Concrete Technology, and Hydrology.',
    capacity: 60,
    nearbyRooms: ['NSOJ Room (302)', 'Classroom 304 (304)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Opposite to Lift A (Left wing)',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift A to 3rd Floor', 'Exit Lift A, turn left', 'Walk past NSOJ Room', 'Classroom 303 is on the left']
  },
  {
    id: 'civil-lab-1',
    number: '305',
    name: 'Geotechnical & Concrete Technology Lab',
    buildingId: 'academic-block',
    floorId: 'floor-3',
    category: 'Lab',
    department: 'Civil Engineering',
    purpose: 'Testing machines for concrete compression, soil mechanics, and survey instruments storage.',
    capacity: 40,
    nearbyRooms: ['Classroom 304 (304)', 'Civil Department Office (301)'],
    nearestLift: 'Lift B',
    nearestWashroom: 'Opposite to Lift A (Left wing)',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift B to 3rd Floor', 'Exit Lift B, turn right', 'Geotechnical Lab is the large corner room on the right']
  },
  {
    id: 'classroom-304',
    number: '304',
    name: 'Civil Classroom 304',
    buildingId: 'academic-block',
    floorId: 'floor-3',
    category: 'Classroom',
    department: 'Civil Engineering',
    purpose: 'Lectures and seminars for final year Civil engineering students.',
    capacity: 55,
    nearbyRooms: ['Classroom 303 (303)', 'Geotechnical Lab (305)'],
    nearestLift: 'Lift B',
    nearestWashroom: 'Opposite to Lift A (Left wing)',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift B to 3rd Floor', 'Exit Lift B, turn right', 'Classroom 304 is the second room on the left']
  },

  // Biotechnology Rooms (Academic Block - Fourth Floor)
  {
    id: 'biotech-office',
    number: '401',
    name: 'Biotechnology HOD & Staff Wing',
    buildingId: 'academic-block',
    floorId: 'floor-4',
    category: 'Faculty Room',
    department: 'Biotechnology',
    purpose: 'Cabins for biotechnology faculty, research guides, and departmental archives.',
    capacity: 12,
    nearbyRooms: ['Microbiology Lab (402)', 'Bioinformatics Lab (405)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Beside West Wing Staircase',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift A to 4th Floor', 'Turn Left, Biotechnology Staff Wing (Room 401) is the first entrance on your left']
  },
  {
    id: 'biotech-lab-1',
    number: '402',
    name: 'Microbiology & Biochemistry Lab',
    buildingId: 'academic-block',
    floorId: 'floor-4',
    category: 'Lab',
    department: 'Biotechnology',
    purpose: 'Sterile laboratory environment for cell culture studies, microbiology assays, and biochemistry testing.',
    capacity: 45,
    nearbyRooms: ['Biotech Staff Wing (401)', 'Classroom 403 (403)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Beside West Wing Staircase',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift A to 4th Floor', 'Turn Left, walk past Room 401', 'Microbiology Lab (Room 402) is on the right']
  },
  {
    id: 'biotech-lab-2',
    number: '405',
    name: 'Bioinformatics & Genetics Lab',
    buildingId: 'academic-block',
    floorId: 'floor-4',
    category: 'Lab',
    department: 'Biotechnology',
    purpose: 'High-performance computing systems for molecular modeling, genome mapping, and bioinformatics analyses.',
    capacity: 40,
    nearbyRooms: ['Classroom 404 (404)', 'Biotech Staff Wing (401)'],
    nearestLift: 'Lift B',
    nearestWashroom: 'Beside West Wing Staircase',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift B to 4th Floor', 'Exit Lift B, turn right', 'Bioinformatics Lab (Room 405) is the double-door cabin on the right']
  },
  {
    id: 'classroom-403',
    number: '403',
    name: 'Biotechnology Classroom 403',
    buildingId: 'academic-block',
    floorId: 'floor-4',
    category: 'Classroom',
    department: 'Biotechnology',
    purpose: 'Core classroom for Biotechnology second and third year lectures.',
    capacity: 50,
    nearbyRooms: ['Microbiology Lab (402)', 'Classroom 404 (404)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Beside West Wing Staircase',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift A to 4th Floor', 'Turn Left, walk past Room 402', 'Classroom 403 is on the left']
  },
  {
    id: 'classroom-404',
    number: '404',
    name: 'Biotechnology Classroom 404',
    buildingId: 'academic-block',
    floorId: 'floor-4',
    category: 'Classroom',
    department: 'Biotechnology',
    purpose: 'Smart classroom for final-year lectures, project presentations, and research updates.',
    capacity: 50,
    nearbyRooms: ['Classroom 403 (403)', 'Bioinformatics Lab (405)'],
    nearestLift: 'Lift B',
    nearestWashroom: 'Beside West Wing Staircase',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift B to 4th Floor', 'Turn Right, Classroom 404 is the first room on the left']
  },

  // Management & Humanities Rooms (Academic Block - Fifth Floor)
  {
    id: 'mba-office',
    number: '501',
    name: 'MBA HOD & MBA Office',
    buildingId: 'academic-block',
    floorId: 'floor-5',
    category: 'Office',
    department: 'Management Studies & Humanities',
    purpose: 'Administrative office for handling MBA curriculum planning, placements, and guest lecture schedules.',
    capacity: 10,
    nearbyRooms: ['MBA Seminar Hall (502)', 'Classroom 503 (503)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Beside Lift B (Right wing)',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift A to 5th Floor', 'Turn Left, Room 501 is the first glass cabin on your left']
  },
  {
    id: 'mba-seminar-hall',
    number: '502',
    name: 'MBA Seminar Hall & Lounge',
    buildingId: 'academic-block',
    floorId: 'floor-5',
    category: 'Classroom',
    department: 'Management Studies & Humanities',
    purpose: 'A modern, premium seminar hall with tiered seating, acoustic paneling, and presentation screens.',
    capacity: 80,
    nearbyRooms: ['MBA Office (501)', 'Classroom 503 (503)'],
    nearestLift: 'Lift A',
    nearestWashroom: 'Beside Lift B (Right wing)',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift A to 5th Floor', 'Turn Left, MBA Seminar Hall is straight ahead at the end of the left wing']
  },
  {
    id: 'classroom-503',
    number: '503',
    name: 'Humanities Classroom 503',
    buildingId: 'academic-block',
    floorId: 'floor-5',
    category: 'Classroom',
    department: 'Management Studies & Humanities',
    purpose: 'Lectures on Professional Communication, Economics, Business Ethics, and Psychology.',
    capacity: 65,
    nearbyRooms: ['MBA Seminar Hall (502)', 'MBA Office (501)'],
    nearestLift: 'Lift B',
    nearestWashroom: 'Beside Lift B (Right wing)',
    directions: ['Main Gate', 'Academic Block Entrance', 'Take Lift B to 5th Floor', 'Turn Right, Classroom 503 is on your left']
  },

  // Admin Block Rooms (Ground Floor)
  {
    id: 'admission-office',
    number: 'ADM-01',
    name: 'Admission Office',
    buildingId: 'administration-block',
    floorId: 'admin-ground',
    category: 'Office',
    purpose: 'Information, brochures, registration, fee collection and seat allocations for prospective students.',
    capacity: 30,
    nearbyRooms: ['Accounts Office (ADM-02)', 'Security Office (ADM-03)'],
    nearestLift: 'Admin Lift',
    nearestWashroom: 'Behind Reception Desk',
    directions: ['Main Gate', 'Walk straight to Administration Block (Right of Main gate)', 'Enter Ground Floor Lobby', 'Admission Office is the first major wing on the left']
  },
  {
    id: 'accounts-office',
    number: 'ADM-02',
    name: 'Accounts & Finance Office',
    buildingId: 'administration-block',
    floorId: 'admin-ground',
    category: 'Office',
    purpose: 'Student tuition fees, faculty salaries, vendor payments, and financial auditing queries.',
    capacity: 20,
    nearbyRooms: ['Admission Office (ADM-01)', 'Security Office (ADM-03)'],
    nearestLift: 'Admin Lift',
    nearestWashroom: 'Behind Reception Desk',
    directions: ['Main Gate', 'Walk to Administration Block', 'Enter Ground Floor Lobby', 'Accounts Office is the second double-door office on the left']
  },
  {
    id: 'security-office-room',
    number: 'ADM-03',
    name: 'Security Office',
    buildingId: 'administration-block',
    floorId: 'admin-ground',
    category: 'Office',
    purpose: 'Campus surveillance management, lost and found, vehicle parking stickers, and identification card issue.',
    capacity: 10,
    nearbyRooms: ['Accounts Office (ADM-02)', 'Medical Room (ADM-04)'],
    nearestLift: 'Admin Lift',
    nearestWashroom: 'Behind Reception Desk',
    directions: ['Main Gate', 'Walk to Administration Block', 'Enter Lobby', 'Security Office is on the right, next to the main entrance reception']
  },
  {
    id: 'medical-room-office',
    number: 'ADM-04',
    name: 'Medical Room',
    buildingId: 'administration-block',
    floorId: 'admin-ground',
    category: 'Office',
    purpose: 'First aid, emergency care, rest beds, and pharmacy support. A qualified campus nurse is on duty 24/7.',
    capacity: 6,
    nearbyRooms: ['Security Office (ADM-03)'],
    nearestLift: 'Admin Lift',
    nearestWashroom: 'Behind Reception Desk',
    directions: ['Main Gate', 'Walk to Administration Block', 'Enter Lobby', 'Turn right, walk past Security Office', 'Medical Room is at the end of the right corridor']
  },

  // Admin Block Rooms (First Floor)
  {
    id: 'principal-office-room',
    number: 'ADM-11',
    name: 'Principal\'s Office',
    buildingId: 'administration-block',
    floorId: 'admin-first',
    category: 'Office',
    purpose: 'Executive office of the Principal. Requires prior appointment with the secretary.',
    capacity: 15,
    nearbyRooms: ['Counselling Office (ADM-12)'],
    nearestLift: 'Admin Lift',
    nearestWashroom: 'Beside Admin Lift lobby',
    directions: ['Main Gate', 'Walk to Administration Block', 'Take Admin Lift to First Floor', 'Exit Lift, turn right', 'The Principal\'s Office double doors are straight ahead']
  },
  {
    id: 'counselling-office-room',
    number: 'ADM-12',
    name: 'Counselling Office & Career Cell',
    buildingId: 'administration-block',
    floorId: 'admin-first',
    category: 'Office',
    purpose: 'Private consulting space for student mental wellness, career advice, and academic mentoring.',
    capacity: 8,
    nearbyRooms: ['Principal\'s Office (ADM-11)'],
    nearestLift: 'Admin Lift',
    nearestWashroom: 'Beside Admin Lift lobby',
    directions: ['Main Gate', 'Walk to Administration Block', 'Take Admin Lift to First Floor', 'Exit Lift, turn left', 'Counselling Office is on your right']
  },

  // Central Annex Rooms (Ground Floor)
  {
    id: 'canteen-room',
    number: 'ANX-01',
    name: 'Campus Canteen',
    buildingId: 'central-annex',
    floorId: 'annex-ground',
    category: 'Facility',
    purpose: 'The central dining area serving breakfast, lunch, snacks, and refreshing beverages for students and faculty.',
    capacity: 250,
    nearbyRooms: [],
    nearestLift: 'Annex Lift',
    nearestWashroom: 'Behind the main dining hall',
    directions: ['Main Gate', 'Walk straight for 50 meters, past the green lawn', 'The Central Annex is on the left', 'Canteen occupies the entire Ground Floor']
  },

  // Central Annex Rooms (First Floor)
  {
    id: 'library-room',
    number: 'ANX-11',
    name: 'Central Library',
    buildingId: 'central-annex',
    floorId: 'annex-first',
    category: 'Facility',
    purpose: 'Spacious study hall, book borrowing counter, computer systems, and quiet discussion rooms.',
    capacity: 180,
    nearbyRooms: ['Placement Cell (ANX-12)'],
    nearestLift: 'Annex Lift',
    nearestWashroom: 'Adjacent to Library entrance lobby',
    directions: ['Main Gate', 'Walk to Central Annex', 'Take Annex Lift or Main Stairs to First Floor', 'Central Library occupies the left wing']
  },
  {
    id: 'placement-cell-room',
    number: 'ANX-12',
    name: 'Placement Cell',
    buildingId: 'central-annex',
    floorId: 'annex-first',
    category: 'Office',
    purpose: 'Manages campus placements, internship recruitments, company interviews, and resume building workshops.',
    capacity: 25,
    nearbyRooms: ['Central Library (ANX-11)'],
    nearestLift: 'Annex Lift',
    nearestWashroom: 'Adjacent to Library entrance lobby',
    directions: ['Main Gate', 'Walk to Central Annex', 'Take Annex Lift to First Floor', 'Turn right, walk past the glass corridor', 'Placement Cell is at the end of the hallway']
  },

  // Central Annex Rooms (Second Floor)
  {
    id: 'coe-room',
    number: 'ANX-21',
    name: 'Center of Excellence (AI & IoT Research)',
    buildingId: 'central-annex',
    floorId: 'annex-second',
    category: 'Lab',
    purpose: 'Advanced research laboratory sponsored by industry partners for artificial intelligence, machine learning, and smart energy systems.',
    capacity: 40,
    nearbyRooms: [],
    nearestLift: 'Annex Lift',
    nearestWashroom: 'Beside Annex Lift lobby',
    directions: ['Main Gate', 'Walk to Central Annex', 'Take Annex Lift to Second Floor', 'Turn right, the Center of Excellence is the glass laboratory suite']
  }
];

export const facilities: Facility[] = [
  {
    id: 'library',
    name: 'Central Library',
    description: 'A quiet three-story library featuring academic textbooks, digital journals, a quiet study zone, and group discussion cubicles.',
    iconName: 'BookOpen',
    floor: 'First Floor',
    building: 'Central Annex & Library',
    openHours: '08:00 AM - 08:00 PM (Mon-Sat)'
  },
  {
    id: 'placement-cell',
    name: 'Placement Cell',
    description: 'Dedicated office hosting recruiters, handling mock interviews, and organizing company campus drives.',
    iconName: 'Briefcase',
    floor: 'First Floor',
    building: 'Central Annex & Library',
    openHours: '09:00 AM - 05:00 PM (Mon-Fri)'
  },
  {
    id: 'admission-office',
    name: 'Admission Office',
    description: 'First point of contact for students seeking admissions, prospectus guides, and counsel on scholarship programs.',
    iconName: 'UserCheck',
    floor: 'Ground Floor',
    building: 'Administration Building',
    openHours: '09:30 AM - 04:30 PM (Mon-Sat)'
  },
  {
    id: 'accounts-office',
    name: 'Accounts Office',
    description: 'Handles student fees, payment structures, scholarships disbursement, and vendor finances.',
    iconName: 'CreditCard',
    floor: 'Ground Floor',
    building: 'Administration Building',
    openHours: '09:30 AM - 04:30 PM (Mon-Fri)'
  },
  {
    id: 'principal-office',
    name: 'Principal Office',
    description: 'Office of the Principal, focusing on academic administration, board meetings, and college policies.',
    iconName: 'Award',
    floor: 'First Floor',
    building: 'Administration Building',
    openHours: '10:00 AM - 01:00 PM (By Appointment)'
  },
  {
    id: 'counselling-office',
    name: 'Counselling Office',
    description: 'A serene space providing student support on academic stress, personal counseling, and mental wellness.',
    iconName: 'HeartHandshake',
    floor: 'First Floor',
    building: 'Administration Building',
    openHours: '10:00 AM - 05:00 PM (Mon-Fri)'
  },
  {
    id: 'center-of-excellence',
    name: 'Center of Excellence',
    description: 'State-of-the-art incubation and research center working on collaborative industry projects, prototyping, and AI/IoT solutions.',
    iconName: 'Cpu',
    floor: 'Second Floor',
    building: 'Central Annex & Library',
    openHours: '09:00 AM - 06:00 PM (Mon-Sat)'
  },
  {
    id: 'football-turf',
    name: 'Football Turf',
    description: 'A premium FIFA-grade synthetic football turf open for students\' recreational gaming and inter-college tournaments.',
    iconName: 'Trophy',
    floor: 'Outdoors',
    building: 'Sports Grounds (East Wing)',
    openHours: '06:00 AM - 08:30 PM (Daily)'
  },
  {
    id: 'basketball-court',
    name: 'Basketball Court',
    description: 'Standard concrete floodlit basketball court with seating stands for audience and players.',
    iconName: 'Dribbble',
    floor: 'Outdoors',
    building: 'Sports Grounds (East Wing)',
    openHours: '06:00 AM - 08:30 PM (Daily)'
  },
  {
    id: 'medical-room',
    name: 'Medical Room',
    description: 'Equipped medical bay with first aid equipment, nurse availability, primary medicines, and local hospital tie-ups.',
    iconName: 'Activity',
    floor: 'Ground Floor',
    building: 'Administration Building',
    openHours: '24 Hours (Daily)'
  },
  {
    id: 'parking',
    name: 'Parking',
    description: 'Two-wheeler and four-wheeler multi-lane parking bays equipped with surveillance cameras and security check gates.',
    iconName: 'ShieldAlert',
    floor: 'Basement & Ground Level',
    building: 'Outdoors (Near Main Gate)',
    openHours: '06:00 AM - 10:00 PM (Daily)'
  },
  {
    id: 'security-office',
    name: 'Security Office',
    description: 'Headquarters of campus security patrol. Handles visitor logbooks, gate passes, and lost & found declarations.',
    iconName: 'Shield',
    floor: 'Ground Floor',
    building: 'Administration Building',
    openHours: '24 Hours (Daily)'
  },
  {
    id: 'bus-stop',
    name: 'Bus Stop',
    description: 'Dedicated bus shelter for college transit services and city buses connecting students to railway and metro lines.',
    iconName: 'Bus',
    floor: 'Outdoors',
    building: 'Near Main Gate Entrance',
    openHours: '07:00 AM - 08:00 PM (Mon-Sat)'
  },
  {
    id: 'canteen',
    name: 'Canteen',
    description: 'Multi-cuisine campus food court offering vegetarian and non-vegetarian options, juices, coffee bars and dining areas.',
    iconName: 'Coffee',
    floor: 'Ground Floor',
    building: 'Central Annex & Library',
    openHours: '07:30 AM - 07:00 PM (Mon-Sat)'
  }
];

export const directory: DirectoryItem[] = [
  { id: 'admission', name: 'Admission Office', type: 'Office', link: '/room/admission-office' },
  { id: 'accounts', name: 'Accounts Office', type: 'Office', link: '/room/accounts-office' },
  { id: 'biotech', name: 'Biotechnology', type: 'Department', link: '/building/academic-block/floor/floor-4' },
  { id: 'computer-science', name: 'Computer Science', type: 'Department', link: '/building/academic-block/floor/ground' },
  { id: 'canteen-dir', name: 'Canteen', type: 'Facility', link: '/room/canteen-room' },
  { id: 'library-dir', name: 'Library', type: 'Facility', link: '/room/library-room' },
  { id: 'placement', name: 'Placement Cell', type: 'Office', link: '/room/placement-cell-room' },
  { id: 'nsoj', name: 'NSOJ Room', type: 'Classroom', link: '/room/nsoj-room' }
];
export const directoryAlphabetical = [
  {
    letter: 'A',
    items: [
      { id: 'admission', name: 'Admission Office', type: 'Office', link: '/room/admission-office' },
      { id: 'accounts', name: 'Accounts Office', type: 'Office', link: '/room/accounts-office' }
    ]
  },
  {
    letter: 'B',
    items: [
      { id: 'biotech', name: 'Biotechnology', type: 'Department', link: '/building/academic-block/floor/floor-4' }
    ]
  },
  {
    letter: 'C',
    items: [
      { id: 'computer-science', name: 'Computer Science', type: 'Department', link: '/building/academic-block/floor/ground' },
      { id: 'canteen-dir', name: 'Canteen', type: 'Facility', link: '/room/canteen-room' }
    ]
  },
  {
    letter: 'L',
    items: [
      { id: 'library-dir', name: 'Library', type: 'Facility', link: '/room/library-room' }
    ]
  },
  {
    letter: 'N',
    items: [
      { id: 'nsoj', name: 'NSOJ Room', type: 'Classroom', link: '/room/nsoj-room' }
    ]
  },
  {
    letter: 'P',
    items: [
      { id: 'placement', name: 'Placement Cell', type: 'Office', link: '/room/placement-cell-room' }
    ]
  }
];
export const emergencyContacts = [
  { id: 'main-sec', name: 'Main Gate Security Office', phone: '+91 80 2345 6789', desc: 'Active 24/7 for security issues, fire emergencies, and trespassers reporting.' },
  { id: 'health-cell', name: 'Medical Room & Health Cell', phone: '+91 80 2345 6788', desc: 'Nurse on duty. First aid and primary health support.' },
  { id: 'anti-ragging', name: 'Anti-Ragging Committee Helpline', phone: '1800 180 5522', desc: 'Toll-free emergency help for bullying or harassment reporting.' },
  { id: 'facilities-head', name: 'Campus Facilities & Maintenance Manager', phone: '+91 80 2345 6787', desc: 'For issues regarding lifts, electrical short-circuits, leaks or blockages.' }
];

export const searchResults: SearchResult[] = [
  ...rooms.map(room => ({
    id: room.id,
    name: room.name + ` (${room.number})`,
    category: room.category as SearchResult['category'],
    floor: floors.find(f => f.id === room.floorId)?.name || 'Unknown Floor',
    building: buildings.find(b => b.id === room.buildingId)?.name || 'Unknown Building',
    nearestLift: room.nearestLift,
    iconName: room.category === 'Lab' ? 'Cpu' : room.category === 'Classroom' ? 'GraduationCap' : room.category === 'Faculty Room' ? 'User' : 'Building',
    link: `/room/${room.id}`
  })),
  ...buildings.map(b => ({
    id: b.id,
    name: b.name,
    category: 'Building' as const,
    iconName: 'Building2',
    link: `/building/${b.id}`
  })),
  ...facilities.map(f => ({
    id: f.id,
    name: f.name,
    category: 'Facility' as const,
    floor: f.floor,
    building: f.building,
    iconName: f.iconName,
    link: `/facilities`
  }))
];
