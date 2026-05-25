export const departments = [
    { code: 'CSE', name: 'Computer Science & Engineering' },
    { code: 'IT', name: 'Information Technology' },
    { code: 'AIML', name: 'Artificial Intelligence & Machine Learning' },
    { code: 'ECE', name: 'Electronics & Communication Engineering' },
    { code: 'DS', name: 'Data Science' },
    { code: 'CYS', name: 'Cyber Security' },
    { code: 'IOT', name: 'Internet of Things' },
    { code: 'EE', name: 'Electrical Engineering' },
    { code: 'CIVIL', name: 'Civil Engineering' }
];

export const defaultResources = {
    youtube: [
        { title: 'Gate Smashers Playlist', url: 'https://www.youtube.com/c/GateSmashers', category: 'YouTube' },
        { title: 'NPTEL Course Lectures', url: 'https://nptel.ac.in/', category: 'YouTube' },
        { title: 'myCodeSchool Programming', url: 'https://www.youtube.com/user/mycodeschool', category: 'YouTube' }
    ],
    pdf: [
        { title: 'MAKAUT Organiser Free PDF', url: 'https://www.makautorganiser.com/', category: 'PDF' },
        { title: 'MAKAUT Study Notes Drive', url: 'https://drive.google.com/drive/folders/1abc123_placeholder', category: 'PDF' }
    ],
    web: [
        { title: 'GeeksforGeeks Reference', url: 'https://www.geeksforgeeks.org/', category: 'Web' },
        { title: 'TutorialsPoint Guide', url: 'https://www.tutorialspoint.com/', category: 'Web' }
    ]
};

export const syllabusData = {
    CSE: {
        1: [
            { id: 'BS-CH101', name: 'Chemistry-I', credits: 4, resources: [
                { title: 'Engineering Chemistry Lectures', url: 'https://www.youtube.com/playlist?list=PLm_MSClSnS1_S2c1t-d96Z573mN_6E_4z', category: 'YouTube' },
                { title: 'Chemistry Core Lecture Notes', url: 'https://www.tutorialspoint.com/engineering_chemistry/index.htm', category: 'Web' }
            ]},
            { id: 'BS-M101', name: 'Mathematics-IA', credits: 4, resources: [
                { title: 'Calculus & Linear Algebra - Gajendra Purohit', url: 'https://www.youtube.com/playlist?list=PLU6SqdYcYsfJ2G6f9M9P5_wzZJd2-j1Fj', category: 'YouTube' },
                { title: 'Maths 1 Textbook Notes', url: 'https://www.geeksforgeeks.org/engineering-mathematics-tutorials/', category: 'Web' }
            ]},
            { id: 'ES-EE101', name: 'Basic Electrical Engineering', credits: 4, resources: [
                { title: 'Basic Electrical - Gate Academy', url: 'https://www.youtube.com/playlist?list=PL9RcWo5_t88wT58A6K7mQW7p-5G4N19-R', category: 'YouTube' }
            ]}
        ],
        2: [
            { id: 'BS-PH201', name: 'Physics-I', credits: 4, resources: [
                { title: 'Engineering Physics Lectures', url: 'https://www.youtube.com/playlist?list=PLg2TC6j_Rnd4U76w5_P2rXU4u9Lvg40Z3', category: 'YouTube' }
            ]},
            { id: 'BS-M201', name: 'Mathematics-IIA', credits: 4, resources: [
                { title: 'Differential Equations & Complex Variables', url: 'https://www.youtube.com/playlist?list=PLU6SqdYcYsfLVY5sI1A1t4nleVrxzK6Xn', category: 'YouTube' }
            ]},
            { id: 'ES-CS201', name: 'Programming for Problem Solving', credits: 3, resources: [
                { title: 'C Programming for Beginners - Neso Academy', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRggZZgYpPMUxdY1CYkZtGCC', category: 'YouTube' },
                { title: 'GeeksforGeeks C Language Portal', url: 'https://www.geeksforgeeks.org/c-programming-language/', category: 'Web' }
            ]}
        ],
        3: [
            { id: 'ESC301', name: 'Analog & Digital Electronics', credits: 3, resources: [
                { title: 'Digital Electronics - Neso Academy', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRggZZgYpPMUxdY1CYkZtGCC', category: 'YouTube' }
            ]},
            { id: 'PCC-CS301', name: 'Data Structure & Algorithm', credits: 3, resources: [
                { title: 'Data Structures - Abdul Bari', url: 'https://www.youtube.com/playlist?list=PL2_aWCzGMAwI3W_yf5Yh8FmTuJFd5G2Vd', category: 'YouTube' },
                { title: 'myCodeSchool DS Playlist', url: 'https://www.youtube.com/playlist?list=PL2_aWCzGMAwI3W_yf5Yh8FmTuJFd5G2Vd', category: 'YouTube' },
                { title: 'Interactive DS Visualizations', url: 'https://visualgo.net/', category: 'Web' }
            ]},
            { id: 'PCC-CS302', name: 'Computer Organisation', credits: 3, resources: [
                { title: 'Computer Organisation & Architecture - Gate Smashers', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiHMonh3G6QNKq53C6oAXGrX', category: 'YouTube' }
            ]},
            { id: 'BSC301', name: 'Mathematics-III (Differential Calculus)', credits: 2, resources: [] }
        ],
        4: [
            { id: 'PCC-CS401', name: 'Discrete Mathematics', credits: 4, resources: [
                { title: 'Discrete Mathematics - Gate Smashers', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFM9LJ5G9G_Fxg-0_56Jp2S', category: 'YouTube' }
            ]},
            { id: 'PCC-CS402', name: 'Computer Architecture', credits: 3, resources: [
                { title: 'Computer Architecture Playlist - Gate Smashers', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiHMonh3G6QNKq53C6oAXGrX', category: 'YouTube' }
            ]},
            { id: 'PCC-CS403', name: 'Formal Language & Automata Theory', credits: 3, resources: [
                { title: 'Theory of Computation - Gate Smashers', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFM9LJ5G9G_Fxg-0_56Jp2S', category: 'YouTube' }
            ]},
            { id: 'PCC-CS404', name: 'Design & Analysis of Algorithms', credits: 3, resources: [
                { title: 'Algorithms by Abdul Bari', url: 'https://www.youtube.com/playlist?list=PLDN4rRl4ldDypG_g-H-Hby7F4Vyp2wNqE', category: 'YouTube' }
            ]}
        ],
        5: [
            { id: 'PCC-CS501', name: 'Software Engineering', credits: 3, resources: [
                { title: 'Software Engineering Tutorials - Gate Smashers', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiEed7SKAD3rJa26tY6rLfVi', category: 'YouTube' }
            ]},
            { id: 'PCC-CS502', name: 'Compiler Design', credits: 3, resources: [
                { title: 'Compiler Design Playlist - Gate Smashers', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFzHSJjYrXSqdNV5tHYAquR', category: 'YouTube' }
            ]},
            { id: 'PCC-CS503', name: 'Operating Systems', credits: 3, resources: [
                { title: 'Operating Systems Course - Gate Smashers', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p', category: 'YouTube' },
                { title: 'OS Lecture Notes & Guides', url: 'https://www.geeksforgeeks.org/operating-systems/', category: 'Web' }
            ]},
            { id: 'PEC-CS501B', name: 'Object Oriented Programming (Java)', credits: 3, resources: [
                { title: 'Java & OOPs Playlist - Kunal Kushwaha', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsPZuuXRgoASTpsLMC', category: 'YouTube' }
            ]}
        ],
        6: [
            { id: 'PCC-CS601', name: 'Database Management Systems', credits: 3, resources: [
                { title: 'DBMS Full Course - Gate Smashers', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I81UbTbXGUNG3XYZQs', category: 'YouTube' },
                { title: 'SQL & Database Guides', url: 'https://www.w3schools.com/sql/', category: 'Web' }
            ]},
            { id: 'PCC-CS602', name: 'Computer Networks', credits: 3, resources: [
                { title: 'Computer Networks - Gate Smashers', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_', category: 'YouTube' }
            ]}
        ],
        7: [
            { id: 'PEC-CS701A', name: 'Artificial Intelligence', credits: 3, resources: [
                { title: 'AI Playlist for University - Gate Smashers', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiEKtW41y1txS_IaVSZtRuHy', category: 'YouTube' }
            ]},
            { id: 'PEC-CS702B', name: 'Cloud Computing', credits: 3, resources: [
                { title: 'Cloud Computing Full Course', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFp-kYiL9IPcg812aPnI6eG', category: 'YouTube' }
            ]}
        ],
        8: [
            { id: 'OEC-CS801A', name: 'E-Commerce & ERP', credits: 3, resources: [] },
            { id: 'OEC-CS802A', name: 'Internet of Things (IoT)', credits: 3, resources: [
                { title: 'IoT Complete Tutorials', url: 'https://www.youtube.com/playlist?list=PLKspK-O2tNcr11S6zly07e5y6499N5K_L', category: 'YouTube' }
            ]}
        ]
    },
    IT: {
        1: [
            { id: 'BS-CH101', name: 'Chemistry-I', credits: 4, resources: [] },
            { id: 'BS-M102', name: 'Mathematics-IB', credits: 4, resources: [] },
            { id: 'ES-EE101', name: 'Basic Electrical Engineering', credits: 4, resources: [] }
        ],
        2: [
            { id: 'BS-PH201', name: 'Physics-I', credits: 4, resources: [] },
            { id: 'BS-M202', name: 'Mathematics-IIB', credits: 4, resources: [] },
            { id: 'ES-CS201', name: 'Programming for Problem Solving', credits: 3, resources: [] }
        ],
        3: [
            { id: 'ESC301', name: 'Analog & Digital Electronics', credits: 3, resources: [] },
            { id: 'PCC-CS301', name: 'Data Structure & Algorithm', credits: 3, resources: [] },
            { id: 'BSC301', name: 'Mathematics-III (Differential Calculus)', credits: 2, resources: [] }
        ],
        4: [
            { id: 'PCC-IT401', name: 'Discrete Mathematics', credits: 4, resources: [] },
            { id: 'PCC-IT402', name: 'Computer Architecture', credits: 3, resources: [] },
            { id: 'PCC-IT403', name: 'Formal Language & Automata Theory', credits: 3, resources: [] },
            { id: 'PCC-IT404', name: 'Design & Analysis of Algorithms', credits: 3, resources: [] }
        ],
        5: [
            { id: 'PCC-IT501', name: 'Software Engineering', credits: 3, resources: [] },
            { id: 'PCC-IT502', name: 'Compiler Design', credits: 3, resources: [] },
            { id: 'PCC-IT503', name: 'Operating Systems', credits: 3, resources: [] }
        ],
        6: [
            { id: 'PCC-IT601', name: 'Database Management Systems', credits: 3, resources: [] },
            { id: 'PCC-IT602', name: 'Computer Networks', credits: 3, resources: [] }
        ],
        7: [
            { id: 'PEC-IT701A', name: 'Cloud Computing', credits: 3, resources: [] },
            { id: 'PEC-IT702A', name: 'Internet of Things', credits: 3, resources: [] }
        ],
        8: [
            { id: 'OEC-IT801A', name: 'E-Commerce', credits: 3, resources: [] }
        ]
    },
    AIML: {
        1: [
            { id: 'BS-CH101', name: 'Chemistry-I', credits: 4, resources: [] },
            { id: 'BS-M101', name: 'Mathematics-IA', credits: 4, resources: [] },
            { id: 'ES-EE101', name: 'Basic Electrical Engineering', credits: 4, resources: [] }
        ],
        2: [
            { id: 'BS-PH201', name: 'Physics-I', credits: 4, resources: [] },
            { id: 'BS-M201', name: 'Mathematics-IIA', credits: 4, resources: [] },
            { id: 'ES-CS201', name: 'Programming for Problem Solving', credits: 3, resources: [] }
        ],
        3: [
            { id: 'PCC-AIML301', name: 'Data Structure & Algorithm', credits: 3, resources: [] },
            { id: 'PCC-AIML302', name: 'Introduction to Artificial Intelligence', credits: 3, resources: [
                { title: 'AI Crash Course - CodeOrg', url: 'https://www.youtube.com/playlist?list=PLzdnOPI1iJNfRzt3C9Z_t07A84S51t66S', category: 'YouTube' }
            ]},
            { id: 'BSC301', name: 'Mathematics-III (Linear Algebra & Calculus)', credits: 4, resources: [] }
        ],
        4: [
            { id: 'PCC-AIML401', name: 'Discrete Mathematics', credits: 4, resources: [] },
            { id: 'PCC-AIML402', name: 'Design & Analysis of Algorithms', credits: 3, resources: [] },
            { id: 'PCC-AIML403', name: 'Introduction to Machine Learning', credits: 4, resources: [
                { title: 'Machine Learning - Andrew Ng', url: 'https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtmLO9VSpzyvy', category: 'YouTube' }
            ]}
        ],
        5: [
            { id: 'PCC-AIML501', name: 'Operating Systems', credits: 3, resources: [] },
            { id: 'PCC-AIML502', name: 'Deep Learning Basics', credits: 3, resources: [
                { title: 'Deep Learning Playlist - 3Blue1Brown', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', category: 'YouTube' }
            ]},
            { id: 'PCC-AIML503', name: 'Database Management Systems', credits: 3, resources: [] }
        ],
        6: [
            { id: 'PCC-AIML601', name: 'Natural Language Processing', credits: 3, resources: [
                { title: 'NLP Stanford Course Lectures', url: 'https://www.youtube.com/playlist?list=PLoROMvodv4rOhwG5HsA0RURyL2453yWcx', category: 'YouTube' }
            ]},
            { id: 'PCC-AIML602', name: 'Computer Networks', credits: 3, resources: [] }
        ],
        7: [
            { id: 'PEC-AIML701', name: 'Computer Vision', credits: 3, resources: [
                { title: 'Intro to Computer Vision - Udacity', url: 'https://www.youtube.com/playlist?list=PLAwxTw4SYaPkQXg8SxgAMVwUj5RWS_11F', category: 'YouTube' }
            ]}
        ],
        8: [
            { id: 'OEC-AIML801', name: 'Reinforcement Learning', credits: 3, resources: [] }
        ]
    },
    ECE: {
        1: [
            { id: 'BS-PH101', name: 'Physics-I', credits: 4, resources: [] },
            { id: 'BS-M102', name: 'Mathematics-IB', credits: 4, resources: [] },
            { id: 'ES-EE101', name: 'Basic Electrical Engineering', credits: 4, resources: [] }
        ],
        2: [
            { id: 'BS-CH201', name: 'Chemistry-I', credits: 4, resources: [] },
            { id: 'BS-M202', name: 'Mathematics-IIB', credits: 4, resources: [] },
            { id: 'ES-CS201', name: 'Programming for Problem Solving', credits: 3, resources: [] }
        ],
        3: [
            { id: 'EC301', name: 'Electronic Devices', credits: 3, resources: [
                { title: 'Electronic Devices & Circuits - Gate Smashers', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFA7t5J0K8C6m4dC1e-m6p7', category: 'YouTube' }
            ]},
            { id: 'EC302', name: 'Digital System Design', credits: 3, resources: [] },
            { id: 'EC303', name: 'Signals & Systems', credits: 3, resources: [
                { title: 'Signals & Systems Lectures - Neso Academy', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRhG6s3jYIU48Cqs15cyiDTO', category: 'YouTube' }
            ]},
            { id: 'EC304', name: 'Network Theory', credits: 3, resources: [] }
        ],
        4: [
            { id: 'EC401', name: 'Analog Communication', credits: 3, resources: [] },
            { id: 'EC402', name: 'Analog Electronic Circuits', credits: 3, resources: [] },
            { id: 'EC403', name: 'Microprocessor & Microcontrollers', credits: 3, resources: [
                { title: '8085 Microprocessor - Bharat Acharya', url: 'https://www.youtube.com/playlist?list=PLWPirh4EWFpEkp5F51jE7K92dG_2u_b2t', category: 'YouTube' }
            ]}
        ],
        5: [
            { id: 'EC501', name: 'Electromagnetic Waves', credits: 3, resources: [] },
            { id: 'EC502', name: 'Computer Architecture', credits: 3, resources: [] },
            { id: 'EC503', name: 'Digital Communication', credits: 3, resources: [] }
        ],
        6: [
            { id: 'EC601', name: 'Control Systems', credits: 3, resources: [
                { title: 'Control Systems - Gate Smashers', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_', category: 'YouTube' }
            ]},
            { id: 'EC602', name: 'Computer Networks', credits: 3, resources: [] }
        ],
        7: [
            { id: 'PEC-EC701', name: 'Embedded Systems', credits: 3, resources: [] }
        ],
        8: [
            { id: 'OEC-EC801', name: 'Mobile Communication', credits: 3, resources: [] }
        ]
    },
    DS: {
        1: [
            { id: 'BS-CH101', name: 'Chemistry-I', credits: 4, resources: [] },
            { id: 'BS-M101', name: 'Mathematics-IA', credits: 4, resources: [] },
            { id: 'ES-EE101', name: 'Basic Electrical Engineering', credits: 4, resources: [] }
        ],
        2: [
            { id: 'BS-PH201', name: 'Physics-I', credits: 4, resources: [] },
            { id: 'BS-M201', name: 'Mathematics-IIA', credits: 4, resources: [] },
            { id: 'ES-CS201', name: 'Programming for Problem Solving', credits: 3, resources: [] }
        ],
        3: [
            { id: 'PCC-DS301', name: 'Data Structure & Algorithm', credits: 3, resources: [] },
            { id: 'PCC-DS302', name: 'Introduction to Data Science', credits: 3, resources: [
                { title: 'Data Science for Beginners - freeCodeCamp', url: 'https://www.youtube.com/playlist?list=PLWKjhJtqVAbmGw5fecFHQaJxN2a1c0Nwb', category: 'YouTube' }
            ]},
            { id: 'BSC-DS301', name: 'Mathematics-III (Linear Algebra)', credits: 4, resources: [] }
        ],
        4: [
            { id: 'PCC-DS401', name: 'Discrete Mathematics', credits: 4, resources: [] },
            { id: 'PCC-DS402', name: 'Design & Analysis of Algorithms', credits: 3, resources: [] },
            { id: 'PCC-DS403', name: 'Data Statistics & Probability', credits: 4, resources: [
                { title: 'Probability & Statistics Tutorials', url: 'https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66PPgLVDS_', category: 'YouTube' }
            ]}
        ],
        5: [
            { id: 'PCC-DS501', name: 'Operating Systems', credits: 3, resources: [] },
            { id: 'PCC-DS502', name: 'Machine Learning', credits: 4, resources: [] },
            { id: 'PCC-DS503', name: 'Database Management Systems', credits: 3, resources: [] }
        ],
        6: [
            { id: 'PCC-DS601', name: 'Big Data Analytics', credits: 3, resources: [
                { title: 'Big Data Full Course - Edureka', url: 'https://www.youtube.com/playlist?list=PL9ooVrP1hQOHY-BeYrKHdrr9pEyz15Z8V', category: 'YouTube' }
            ]},
            { id: 'PCC-DS602', name: 'Data Visualization Techniques', credits: 3, resources: [] }
        ],
        7: [
            { id: 'PEC-DS701', name: 'Deep Learning', credits: 3, resources: [] }
        ],
        8: [
            { id: 'OEC-DS801', name: 'Business Intelligence', credits: 3, resources: [] }
        ]
    },
    CYS: {
        1: [
            { id: 'BS-CH101', name: 'Chemistry-I', credits: 4, resources: [] },
            { id: 'BS-M101', name: 'Mathematics-IA', credits: 4, resources: [] },
            { id: 'ES-EE101', name: 'Basic Electrical Engineering', credits: 4, resources: [] }
        ],
        2: [
            { id: 'BS-PH201', name: 'Physics-I', credits: 4, resources: [] },
            { id: 'BS-M201', name: 'Mathematics-IIA', credits: 4, resources: [] },
            { id: 'ES-CS201', name: 'Programming for Problem Solving', credits: 3, resources: [] }
        ],
        3: [
            { id: 'PCC-CYS301', name: 'Data Structure & Algorithm', credits: 3, resources: [] },
            { id: 'PCC-CYS302', name: 'Fundamentals of Cyber Security', credits: 3, resources: [
                { title: 'Cyber Security Full Course - freeCodeCamp', url: 'https://www.youtube.com/playlist?list=PLWKjhJtqVAbmGw5fecFHQaJxN2a1c0Nwb', category: 'YouTube' }
            ]},
            { id: 'BSC301', name: 'Discrete Structures', credits: 4, resources: [] }
        ],
        4: [
            { id: 'PCC-CYS401', name: 'Computer Organisation & Architecture', credits: 3, resources: [] },
            { id: 'PCC-CYS402', name: 'Design & Analysis of Algorithms', credits: 3, resources: [] },
            { id: 'PCC-CYS403', name: 'Introduction to Cryptography', credits: 4, resources: [
                { title: 'Cryptography Tutorials - Gate Smashers', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiG3-13yB7aW1eC7O147yM-m', category: 'YouTube' }
            ]}
        ],
        5: [
            { id: 'PCC-CYS501', name: 'Operating Systems & Security', credits: 3, resources: [] },
            { id: 'PCC-CYS502', name: 'Network Security', credits: 4, resources: [] },
            { id: 'PCC-CYS503', name: 'Database Security', credits: 3, resources: [] }
        ],
        6: [
            { id: 'PCC-CYS601', name: 'Ethical Hacking & Penetration Testing', credits: 3, resources: [
                { title: 'Ethical Hacking Course - freeCodeCamp', url: 'https://www.youtube.com/playlist?list=PLWKjhJtqVAblvI11Ry3FjM47S14UvjM1e', category: 'YouTube' }
            ]},
            { id: 'PCC-CYS602', name: 'Computer Networks & Security Protocols', credits: 3, resources: [] }
        ],
        7: [
            { id: 'PEC-CYS701', name: 'Cyber Forensics & Incident Response', credits: 3, resources: [] }
        ],
        8: [
            { id: 'OEC-CYS801', name: 'Cyber Laws & Security Policies', credits: 3, resources: [] }
        ]
    },
    IOT: {
        1: [
            { id: 'BS-CH101', name: 'Chemistry-I', credits: 4, resources: [] },
            { id: 'BS-M101', name: 'Mathematics-IA', credits: 4, resources: [] },
            { id: 'ES-EE101', name: 'Basic Electrical Engineering', credits: 4, resources: [] }
        ],
        2: [
            { id: 'BS-PH201', name: 'Physics-I', credits: 4, resources: [] },
            { id: 'BS-M201', name: 'Mathematics-IIA', credits: 4, resources: [] },
            { id: 'ES-CS201', name: 'Programming for Problem Solving', credits: 3, resources: [] }
        ],
        3: [
            { id: 'PCC-IOT301', name: 'Data Structure & Algorithm', credits: 3, resources: [] },
            { id: 'PCC-IOT302', name: 'Sensors & Actuators in IoT', credits: 3, resources: [
                { title: 'IoT Sensors & Microcontrollers Lectures', url: 'https://www.youtube.com/playlist?list=PL3QYQJfqQ-scZfQ4mJ6Hn6mH5fK07kP_t', category: 'YouTube' }
            ]},
            { id: 'BSC301', name: 'Discrete Structures', credits: 4, resources: [] }
        ],
        4: [
            { id: 'PCC-IOT401', name: 'Embedded Systems for IoT', credits: 4, resources: [] },
            { id: 'PCC-IOT402', name: 'IoT Architecture & Protocols', credits: 3, resources: [
                { title: 'IoT Architecture and Communication Protocols', url: 'https://www.youtube.com/playlist?list=PLKspK-O2tNcr11S6zly07e5y6499N5K_L', category: 'YouTube' }
            ]}
        ],
        5: [
            { id: 'PCC-IOT501', name: 'Microcontrollers & Arduino', credits: 3, resources: [] },
            { id: 'PCC-IOT502', name: 'Operating Systems for Embedded IoT', credits: 3, resources: [] },
            { id: 'PCC-IOT503', name: 'IoT Security & Privacy', credits: 3, resources: [] }
        ],
        6: [
            { id: 'PCC-IOT601', name: 'Cloud Computing & IoT Platforms', credits: 3, resources: [] },
            { id: 'PCC-IOT602', name: 'Wireless Sensor Networks', credits: 3, resources: [] }
        ],
        7: [
            { id: 'PEC-IOT701', name: 'Smart Cities & Industrial IoT (IIoT)', credits: 3, resources: [] }
        ],
        8: [
            { id: 'OEC-IOT801', name: 'Edge AI & Analytics', credits: 3, resources: [] }
        ]
    },
    EE: {
        1: [
            { id: 'BS-PH101', name: 'Physics-I', credits: 4, resources: [] },
            { id: 'BS-M102', name: 'Mathematics-IB', credits: 4, resources: [] },
            { id: 'ES-EE101', name: 'Basic Electrical Engineering', credits: 4, resources: [] }
        ],
        2: [
            { id: 'BS-CH201', name: 'Chemistry-I', credits: 4, resources: [] },
            { id: 'BS-M202', name: 'Mathematics-IIB', credits: 4, resources: [] },
            { id: 'ES-CS201', name: 'Programming for Problem Solving', credits: 3, resources: [] }
        ],
        3: [
            { id: 'PC-EE301', name: 'Electric Circuit Theory', credits: 3, resources: [
                { title: 'Network Theory - Gate Academy', url: 'https://www.youtube.com/playlist?list=PL9RcWo5_t88yN9S7aP1F41R1kLq5J-QG_', category: 'YouTube' }
            ]},
            { id: 'PC-EE302', name: 'Analog Electronics', credits: 3, resources: [] },
            { id: 'PC-EE303', name: 'Electromagnetic Field Theory', credits: 3, resources: [] },
            { id: 'BS-M301', name: 'Mathematics-III (Numerical Methods)', credits: 3, resources: [] }
        ],
        4: [
            { id: 'PC-EE401', name: 'Electric Machines-I', credits: 4, resources: [
                { title: 'Electrical Machines - Gate Smashers', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiEKtW41y1txS_IaVSZtRuHy', category: 'YouTube' }
            ]},
            { id: 'PC-EE402', name: 'Digital Electronics', credits: 3, resources: [] },
            { id: 'PC-EE403', name: 'Electrical & Electronic Measurements', credits: 3, resources: [] }
        ],
        5: [
            { id: 'PC-EE501', name: 'Electric Machines-II', credits: 4, resources: [] },
            { id: 'PC-EE502', name: 'Power System-I', credits: 4, resources: [
                { title: 'Power Systems Lectures - Gate Academy', url: 'https://www.youtube.com/playlist?list=PL9RcWo5_t88xqW0J2q8cZgX1W423M3q0W', category: 'YouTube' }
            ]},
            { id: 'PC-EE503', name: 'Control Systems', credits: 3, resources: [] }
        ],
        6: [
            { id: 'PC-EE601', name: 'Power System-II', credits: 4, resources: [] },
            { id: 'PC-EE602', name: 'Power Electronics', credits: 4, resources: [
                { title: 'Power Electronics Full Course - Gate Academy', url: 'https://www.youtube.com/playlist?list=PL9RcWo5_t88xVlR4T19U5y5H949Gg2Mh2', category: 'YouTube' }
            ]}
        ],
        7: [
            { id: 'PE-EE701', name: 'High Voltage Engineering', credits: 3, resources: [] }
        ],
        8: [
            { id: 'OE-EE801', name: 'Smart Grid Technologies', credits: 3, resources: [] }
        ]
    },
    CIVIL: {
        1: [
            { id: 'BS-PH101', name: 'Physics-I', credits: 4, resources: [] },
            { id: 'BS-M102', name: 'Mathematics-IB', credits: 4, resources: [] },
            { id: 'ES-ME101', name: 'Engineering Mechanics', credits: 4, resources: [
                { title: 'Engineering Mechanics Lectures - Gate Academy', url: 'https://www.youtube.com/playlist?list=PL9RcWo5_t88wT58A6K7mQW7p-5G4N19-R', category: 'YouTube' }
            ]}
        ],
        2: [
            { id: 'BS-CH201', name: 'Chemistry-I', credits: 4, resources: [] },
            { id: 'BS-M202', name: 'Mathematics-IIB', credits: 4, resources: [] },
            { id: 'ES-CS201', name: 'Programming for Problem Solving', credits: 3, resources: [] }
        ],
        3: [
            { id: 'PC-CE301', name: 'Introduction to Solid Mechanics', credits: 3, resources: [
                { title: 'Strength of Materials - NPTEL', url: 'https://www.youtube.com/playlist?list=PLbMVogVj5nJS3PZ2L_y0-8WfD0cI0E_8E', category: 'YouTube' }
            ]},
            { id: 'PC-CE302', name: 'Surveying & Geomatics', credits: 3, resources: [] },
            { id: 'PC-CE303', name: 'Engineering Geology', credits: 3, resources: [] }
        ],
        4: [
            { id: 'PC-CE401', name: 'Concrete Technology', credits: 3, resources: [] },
            { id: 'PC-CE402', name: 'Structural Analysis-I', credits: 4, resources: [
                { title: 'Structural Analysis Tutorials - Gate Academy', url: 'https://www.youtube.com/playlist?list=PL9RcWo5_t88wJv863n9f81_LzR89C7T9B', category: 'YouTube' }
            ]},
            { id: 'PC-CE403', name: 'Transportation Engineering', credits: 3, resources: [] }
        ],
        5: [
            { id: 'PC-CE501', name: 'Design of RC Structures', credits: 3, resources: [] },
            { id: 'PC-CE502', name: 'Soil Mechanics-I', credits: 4, resources: [
                { title: 'Geotechnical Engineering Lectures', url: 'https://www.youtube.com/playlist?list=PLbMVogVj5nJTF12lR7F6H05X-k_H3Q0S_', category: 'YouTube' }
            ]},
            { id: 'PC-CE503', name: 'Hydrology & Water Resources', credits: 3, resources: [] }
        ],
        6: [
            { id: 'PC-CE601', name: 'Design of Steel Structures', credits: 3, resources: [] },
            { id: 'PC-CE602', name: 'Soil Mechanics-II', credits: 4, resources: [] }
        ],
        7: [
            { id: 'PE-CE701', name: 'Environmental Engineering-II', credits: 3, resources: [] }
        ],
        8: [
            { id: 'OE-CE801', name: 'Construction Engineering & Management', credits: 3, resources: [] }
        ]
    }
};
