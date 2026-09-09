import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const OFFICIAL = {
  sourceURL: "https://adamasuniversity.ac.in/",
  sourceTitle: "Adamas University Official Website",
  sourceType: "OFFICIAL" as const,
  retrievedAt: new Date("2026-09-01"),
  lastVerified: new Date("2026-09-01"),
  confidence: 1.0,
  status: "VERIFIED" as const,
};

const SCHOOLS = [
  { name: "School of Engineering and Technology", slug: "soet", shortName: "SOET" },
  { name: "School of Basic and Applied Sciences", slug: "sbas", shortName: "SBAS" },
  { name: "School of Liberal Arts and Culture Studies", slug: "slacs", shortName: "SLACS" },
  { name: "School of Business", slug: "sob", shortName: "SOB" },
  { name: "School of Law and Justice", slug: "solj", shortName: "SOLJ" },
  { name: "School of Media and Communication", slug: "somc", shortName: "SOMC" },
  { name: "School of Education", slug: "soe", shortName: "SOE" },
  { name: "School of Life Science and Biotechnology", slug: "slsb", shortName: "SLSB" },
  { name: "School of Health and Medical Sciences", slug: "shms", shortName: "SHMS" },
  { name: "School of Smart Agriculture", slug: "ssa", shortName: "SSA" },
];

const CLUBS = [
  { name: "Musicorum", slug: "musicorum", category: "Arts", description: "Music society for vocal and instrumental performance across genres.", tags: '["music","performance"]' },
  { name: "Robotics and AI Club", slug: "robotics-ai", category: "Technology", description: "Hands-on robotics, embedded systems, and applied AI projects.", tags: '["robotics","ai","tech"]' },
  { name: "Jhankar", slug: "jhankar", category: "Arts", description: "Dance club celebrating classical and contemporary forms.", tags: '["dance","performance"]' },
  { name: "CrossFit–Health", slug: "crossfit-health", category: "Fitness", description: "Fitness and wellness community focused on strength and conditioning.", tags: '["fitness","health"]' },
  { name: "Kissewala Film & Drama", slug: "kissewala", category: "Arts", description: "Film appreciation, short films, and theatrical productions.", tags: '["film","drama"]' },
  { name: "Biotechnology Club", slug: "biotech-club", category: "Science", description: "Life sciences exploration, lab demos, and biotech outreach.", tags: '["biotech","science"]' },
  { name: "Katha Kalaaj", slug: "katha-kalaaj", category: "Arts", description: "Storytelling and literary arts collective.", tags: '["literature","storytelling"]' },
  { name: "Nature Nurturers", slug: "nature-nurturers", category: "Environment", description: "Campus ecology, sustainability, and green initiatives.", tags: '["environment","sustainability"]' },
  { name: "Entrepreneurship Club", slug: "entrepreneurship", category: "Business", description: "Startup mindset, ideation workshops, and founder meetups.", tags: '["startup","business"]' },
  { name: "Litwiz", slug: "litwiz", category: "Arts", description: "Literary society for reading circles, debates, and writing.", tags: '["literature","debate"]' },
  { name: "Empathy", slug: "empathy", category: "Social", description: "Social work and community service initiatives.", tags: '["social-work","community"]' },
  { name: "Artsym", slug: "artsym", category: "Arts", description: "Visual arts, design, and creative expression.", tags: '["art","design"]' },
  { name: "Cy-Coder’s", slug: "cy-coders", category: "Technology", description: "Competitive programming, open source, and developer culture.", tags: '["coding","tech"]' },
  { name: "Junk Innovation", slug: "junk-innovation", category: "Innovation", description: "Upcycling and frugal innovation from scrap and waste materials.", tags: '["innovation","upcycling"]' },
  { name: "Electoral Literacy", slug: "electoral-literacy", category: "Civic", description: "Voter awareness and democratic participation education.", tags: '["civic","democracy"]' },
];

async function main() {
  console.log("Seeding CampusOS — Adamas University...");

  // Wipe in FK-safe order
  await prisma.adminSession.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.ideaSubmission.deleteMany();
  await prisma.notificationPref.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.timetableSlot.deleteMany();
  await prisma.demoStudent.deleteMany();
  await prisma.pulseStatus.deleteMany();
  await prisma.globalClaim.deleteMany();
  await prisma.route.deleteMany();
  await prisma.campusEdge.deleteMany();
  await prisma.event.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.hostel.deleteMany();
  await prisma.laboratory.deleteMany();
  await prisma.course.deleteMany();
  await prisma.person.deleteMany();
  await prisma.room.deleteMany();
  // Disconnect buildings from nodes before deleting nodes
  await prisma.building.updateMany({ data: { nodeId: null } });
  await prisma.building.deleteMany();
  await prisma.campusNode.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.service.deleteMany();
  await prisma.libraryResource.deleteMany();
  await prisma.researchCenter.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.club.deleteMany();
  await prisma.programme.deleteMany();
  await prisma.department.deleteMany();
  await prisma.school.deleteMany();
  await prisma.university.deleteMany();

  const uni = await prisma.university.create({
    data: {
      name: "Adamas University",
      shortName: "AU",
      address:
        "Barasat–Barrackpore Road, P.O. Jagannathpur, District 24 Parganas (North), Kolkata – 700126, West Bengal, India",
      city: "Kolkata",
      state: "West Bengal",
      country: "India",
      pincode: "700126",
      website: "https://adamasuniversity.ac.in/",
      description:
        "Adamas University is part of Adamas Knowledge City — a multi-disciplinary university in North 24 Parganas, West Bengal. CampusOS is its digital operating layer: search, understand, navigate, and act.",
      ...OFFICIAL,
    },
  });

  // —— Campus nodes (relative SVG layout 0–1000; topology only, no GPS) ——
  const nodes = await Promise.all(
    [
      { name: "Main Gate", slug: "main-gate", kind: "GATE", x: 80, y: 520, label: "Main Gate" },
      { name: "Central Plaza", slug: "central-plaza", kind: "JUNCTION", x: 280, y: 480, label: "Plaza" },
      { name: "SOET Block", slug: "soet-block", kind: "BUILDING", x: 420, y: 320, label: "SOET" },
      { name: "Science Block", slug: "science-block", kind: "BUILDING", x: 560, y: 280, label: "Sciences" },
      { name: "Business & Law", slug: "business-law", kind: "BUILDING", x: 480, y: 520, label: "SOB / SOLJ" },
      { name: "Library", slug: "library-node", kind: "FACILITY", x: 360, y: 420, label: "Library" },
      { name: "Admin Block", slug: "admin-block", kind: "BUILDING", x: 220, y: 360, label: "Admin" },
      { name: "Hostel Zone", slug: "hostel-zone", kind: "LANDMARK", x: 700, y: 560, label: "Hostels" },
      { name: "Food Court", slug: "food-court", kind: "FACILITY", x: 340, y: 600, label: "Food" },
      { name: "Sports Complex", slug: "sports-complex", kind: "FACILITY", x: 620, y: 680, label: "Sports" },
      { name: "Media & Arts", slug: "media-arts", kind: "BUILDING", x: 180, y: 620, label: "Media / Arts" },
      { name: "Life Sciences", slug: "life-sciences", kind: "BUILDING", x: 680, y: 360, label: "SLSB" },
      { name: "Health Sciences", slug: "health-sciences", kind: "BUILDING", x: 780, y: 440, label: "SHMS" },
      { name: "Agriculture Hub", slug: "agri-hub", kind: "BUILDING", x: 820, y: 280, label: "SSA" },
      { name: "Innovation Hub", slug: "innovation-hub", kind: "FACILITY", x: 500, y: 400, label: "Innovation" },
    ].map((n) => prisma.campusNode.create({ data: n }))
  );

  const bySlug = Object.fromEntries(nodes.map((n) => [n.slug, n]));

  const edgePairs: [string, string, number][] = [
    ["main-gate", "central-plaza", 1],
    ["central-plaza", "admin-block", 1],
    ["central-plaza", "library-node", 1],
    ["central-plaza", "soet-block", 1.2],
    ["central-plaza", "business-law", 1],
    ["central-plaza", "food-court", 1],
    ["central-plaza", "media-arts", 1.3],
    ["library-node", "soet-block", 0.8],
    ["library-node", "innovation-hub", 0.7],
    ["soet-block", "science-block", 1],
    ["soet-block", "innovation-hub", 0.8],
    ["science-block", "life-sciences", 1],
    ["science-block", "agri-hub", 1.2],
    ["business-law", "food-court", 0.9],
    ["business-law", "hostel-zone", 1.4],
    ["food-court", "sports-complex", 1.2],
    ["food-court", "media-arts", 1],
    ["hostel-zone", "sports-complex", 1],
    ["hostel-zone", "health-sciences", 1],
    ["life-sciences", "health-sciences", 1],
    ["life-sciences", "agri-hub", 1],
    ["innovation-hub", "business-law", 0.9],
  ];

  for (const [a, b, w] of edgePairs) {
    await prisma.campusEdge.create({
      data: {
        fromNodeId: bySlug[a].id,
        toNodeId: bySlug[b].id,
        weight: w,
        bidirectional: true,
      },
    });
  }

  // Buildings linked to nodes
  const bSOET = await prisma.building.create({
    data: {
      name: "School of Engineering and Technology Block",
      slug: "building-soet",
      code: "SOET",
      description: "Engineering classrooms, labs, and faculty offices.",
      universityId: uni.id,
      nodeId: bySlug["soet-block"].id,
      ...OFFICIAL,
      confidence: 0.9,
    },
  });
  const bScience = await prisma.building.create({
    data: {
      name: "Science Block",
      slug: "building-science",
      code: "SCI",
      universityId: uni.id,
      nodeId: bySlug["science-block"].id,
      ...OFFICIAL,
      confidence: 0.85,
    },
  });
  const bAdmin = await prisma.building.create({
    data: {
      name: "Administrative Block",
      slug: "building-admin",
      code: "ADM",
      universityId: uni.id,
      nodeId: bySlug["admin-block"].id,
      ...OFFICIAL,
      confidence: 0.9,
    },
  });
  const bLib = await prisma.building.create({
    data: {
      name: "Central Library",
      slug: "building-library",
      code: "LIB",
      universityId: uni.id,
      nodeId: bySlug["library-node"].id,
      ...OFFICIAL,
      confidence: 0.9,
    },
  });
  const bBiz = await prisma.building.create({
    data: {
      name: "Business & Law Complex",
      slug: "building-biz-law",
      code: "BL",
      universityId: uni.id,
      nodeId: bySlug["business-law"].id,
      ...OFFICIAL,
      confidence: 0.85,
    },
  });

  const roomAI = await prisma.room.create({
    data: {
      name: "AI & ML Lab Classroom",
      code: "SOET-301",
      floor: "3",
      type: "CLASSROOM",
      capacity: 60,
      buildingId: bSOET.id,
      ...OFFICIAL,
      confidence: 0.85,
      sourceTitle: "Demo campus layout (relative)",
      sourceType: "USER",
      status: "UNVERIFIED",
    },
  });
  const roomCS = await prisma.room.create({
    data: {
      name: "CSE Lecture Hall",
      code: "SOET-201",
      floor: "2",
      type: "CLASSROOM",
      capacity: 80,
      buildingId: bSOET.id,
      sourceType: "USER",
      status: "UNVERIFIED",
      confidence: 0.8,
    },
  });
  const roomLab = await prisma.room.create({
    data: {
      name: "Computing Lab 1",
      code: "SOET-L1",
      floor: "1",
      type: "LAB",
      capacity: 40,
      buildingId: bSOET.id,
      sourceType: "USER",
      status: "UNVERIFIED",
      confidence: 0.8,
    },
  });

  // Schools
  const schoolRecords = [];
  for (const s of SCHOOLS) {
    schoolRecords.push(
      await prisma.school.create({
        data: {
          ...s,
          description: `${s.name} at Adamas University.`,
          universityId: uni.id,
          ...OFFICIAL,
          confidence: 0.95,
        },
      })
    );
  }
  const soet = schoolRecords[0];

  const deptCSE = await prisma.department.create({
    data: {
      name: "Computer Science and Engineering",
      slug: "cse",
      schoolId: soet.id,
      description: "CSE programmes including AI & Machine Learning specialisations.",
      ...OFFICIAL,
      confidence: 0.9,
    },
  });

  const progAIML = await prisma.programme.create({
    data: {
      name: "B.Tech CSE — AI & Machine Learning",
      slug: "btech-cse-aiml",
      degree: "B.Tech",
      duration: "4 years",
      schoolId: soet.id,
      departmentId: deptCSE.id,
      description:
        "Undergraduate programme in Computer Science and Engineering with specialisation in Artificial Intelligence and Machine Learning.",
      ...OFFICIAL,
      confidence: 0.9,
    },
  });

  // Leadership — sourced
  await prisma.person.create({
    data: {
      name: "Prof. (Dr.) Samit Ray",
      slug: "samit-ray",
      role: "LEADERSHIP",
      title: "Prof. (Dr.)",
      designation: "Founder Chancellor",
      universityId: uni.id,
      bio: "Founder Chancellor of Adamas University.",
      sourceURL: "https://adamasuniversity.ac.in/",
      sourceTitle: "Adamas University — Leadership",
      sourceType: "OFFICIAL",
      retrievedAt: new Date("2026-09-01"),
      lastVerified: new Date("2026-09-01"),
      confidence: 0.95,
      status: "VERIFIED",
    },
  });
  await prisma.person.create({
    data: {
      name: "Prof. (Dr.) Naveen Das",
      slug: "naveen-das",
      role: "LEADERSHIP",
      title: "Prof. (Dr.)",
      designation: "Vice Chancellor (Officiating)",
      universityId: uni.id,
      bio: "Vice Chancellor (Officiating), Adamas University.",
      sourceURL: "https://adamasuniversity.ac.in/",
      sourceTitle: "Adamas University — Leadership",
      sourceType: "OFFICIAL",
      retrievedAt: new Date("2026-09-01"),
      lastVerified: new Date("2026-09-01"),
      confidence: 0.95,
      status: "VERIFIED",
    },
  });

  const facultyAI = await prisma.person.create({
    data: {
      name: "Dr. Meera Banerjee",
      slug: "meera-banerjee",
      role: "FACULTY",
      title: "Dr.",
      designation: "Associate Professor",
      schoolId: soet.id,
      universityId: uni.id,
      bio: "Faculty in AI & Machine Learning (demo profile for CampusOS).",
      email: "demo.faculty@adamasuniversity.ac.in",
      sourceType: "USER",
      sourceTitle: "CampusOS demo faculty profile",
      confidence: 0.5,
      status: "UNVERIFIED",
    },
  });
  await prisma.person.create({
    data: {
      name: "Prof. Aniket Ghosh",
      slug: "aniket-ghosh",
      role: "FACULTY",
      title: "Prof.",
      designation: "Professor",
      schoolId: soet.id,
      universityId: uni.id,
      bio: "Systems and software engineering (demo profile).",
      sourceType: "USER",
      sourceTitle: "CampusOS demo faculty profile",
      confidence: 0.5,
      status: "UNVERIFIED",
    },
  });
  await prisma.person.create({
    data: {
      name: "Ms. Priya Halder",
      slug: "priya-halder",
      role: "STAFF",
      designation: "Academic Coordinator",
      schoolId: soet.id,
      universityId: uni.id,
      bio: "Academic coordination for undergraduate programmes (demo).",
      sourceType: "USER",
      confidence: 0.5,
      status: "UNVERIFIED",
    },
  });

  const courseAI = await prisma.course.create({
    data: {
      code: "CSE-401",
      name: "Artificial Intelligence",
      credits: 4,
      semester: 6,
      departmentId: deptCSE.id,
      programmeId: progAIML.id,
      facultyId: facultyAI.id,
      roomId: roomAI.id,
      description: "Core AI concepts, search, knowledge representation, and ML foundations.",
      sourceType: "USER",
      confidence: 0.8,
      status: "UNVERIFIED",
    },
  });
  const courseML = await prisma.course.create({
    data: {
      code: "CSE-402",
      name: "Machine Learning",
      credits: 4,
      semester: 6,
      departmentId: deptCSE.id,
      programmeId: progAIML.id,
      facultyId: facultyAI.id,
      roomId: roomCS.id,
      description: "Supervised and unsupervised learning, model evaluation, applied ML.",
      sourceType: "USER",
      confidence: 0.8,
      status: "UNVERIFIED",
    },
  });
  const courseDB = await prisma.course.create({
    data: {
      code: "CSE-303",
      name: "Database Systems",
      credits: 3,
      semester: 5,
      departmentId: deptCSE.id,
      programmeId: progAIML.id,
      roomId: roomLab.id,
      description: "Relational models, SQL, and data management.",
      sourceType: "USER",
      confidence: 0.8,
      status: "UNVERIFIED",
    },
  });
  const courseSE = await prisma.course.create({
    data: {
      code: "CSE-305",
      name: "Software Engineering",
      credits: 3,
      semester: 5,
      departmentId: deptCSE.id,
      programmeId: progAIML.id,
      roomId: roomCS.id,
      description: "Software process, design, and team delivery.",
      sourceType: "USER",
      confidence: 0.8,
      status: "UNVERIFIED",
    },
  });

  const student = await prisma.demoStudent.create({
    data: {
      name: "Aarav Sen",
      programmeId: progAIML.id,
      year: 3,
      semester: 6,
      fictional: true,
    },
  });

  // Timetable — Aarav's week
  const slots: { day: number; start: string; end: string; courseId: string; roomId: string }[] = [
    { day: 1, start: "09:00", end: "10:00", courseId: courseAI.id, roomId: roomAI.id },
    { day: 1, start: "11:00", end: "12:00", courseId: courseML.id, roomId: roomCS.id },
    { day: 2, start: "10:00", end: "11:00", courseId: courseDB.id, roomId: roomLab.id },
    { day: 2, start: "14:00", end: "15:00", courseId: courseSE.id, roomId: roomCS.id },
    { day: 3, start: "09:00", end: "10:00", courseId: courseAI.id, roomId: roomAI.id },
    { day: 3, start: "15:00", end: "16:00", courseId: courseML.id, roomId: roomCS.id },
    { day: 4, start: "11:00", end: "12:00", courseId: courseDB.id, roomId: roomLab.id },
    { day: 5, start: "09:00", end: "10:00", courseId: courseSE.id, roomId: roomCS.id },
    { day: 5, start: "13:00", end: "14:00", courseId: courseAI.id, roomId: roomAI.id },
  ];
  for (const s of slots) {
    await prisma.timetableSlot.create({
      data: {
        dayOfWeek: s.day,
        startTime: s.start,
        endTime: s.end,
        courseId: s.courseId,
        roomId: s.roomId,
        studentId: student.id,
      },
    });
  }

  await prisma.exam.create({
    data: {
      title: "AI Mid-Semester Assessment",
      courseId: courseAI.id,
      startsAt: new Date("2026-10-15T10:00:00+05:30"),
      endsAt: new Date("2026-10-15T12:00:00+05:30"),
      roomId: roomAI.id,
      studentId: student.id,
    },
  });
  await prisma.exam.create({
    data: {
      title: "Machine Learning Quiz",
      courseId: courseML.id,
      startsAt: new Date("2026-10-08T14:00:00+05:30"),
      endsAt: new Date("2026-10-08T15:00:00+05:30"),
      roomId: roomCS.id,
      studentId: student.id,
    },
  });

  // Demo route: Main Gate → SOET (AI class)
  const pathToAI = [
    bySlug["main-gate"].id,
    bySlug["central-plaza"].id,
    bySlug["soet-block"].id,
  ];
  await prisma.route.create({
    data: {
      name: "Main Gate to SOET Block",
      slug: "gate-to-soet",
      fromNodeId: bySlug["main-gate"].id,
      toNodeId: bySlug["soet-block"].id,
      pathNodeIds: JSON.stringify(pathToAI),
      description: "Primary walking path from Main Gate to the Engineering block (topology hops).",
    },
  });

  for (const c of CLUBS) {
    await prisma.club.create({
      data: {
        ...c,
        universityId: uni.id,
        meetingInfo: "Check Events for upcoming sessions.",
        sourceType: "USER",
        sourceTitle: "CampusOS club directory (campus community listing)",
        confidence: 0.75,
        status: "VERIFIED",
        retrievedAt: new Date("2026-09-01"),
      },
    });
  }

  const robotics = await prisma.club.findUniqueOrThrow({ where: { slug: "robotics-ai" } });
  const musicorum = await prisma.club.findUniqueOrThrow({ where: { slug: "musicorum" } });

  await prisma.event.create({
    data: {
      title: "Robotics Open House",
      slug: "robotics-open-house",
      description: "Demo day for student-built robots and AI projects. Open to all schools.",
      startAt: new Date("2026-09-20T16:00:00+05:30"),
      endAt: new Date("2026-09-20T18:00:00+05:30"),
      location: "Innovation Hub",
      venueNodeId: bySlug["innovation-hub"].id,
      clubId: robotics.id,
      universityId: uni.id,
      sourceType: "USER",
      confidence: 0.8,
      status: "VERIFIED",
    },
  });
  await prisma.event.create({
    data: {
      title: "Musicorum Evening Concert",
      slug: "musicorum-concert",
      description: "Campus music night featuring student ensembles.",
      startAt: new Date("2026-09-27T18:00:00+05:30"),
      endAt: new Date("2026-09-27T20:30:00+05:30"),
      location: "Central Plaza",
      venueNodeId: bySlug["central-plaza"].id,
      clubId: musicorum.id,
      universityId: uni.id,
      sourceType: "USER",
      confidence: 0.8,
      status: "VERIFIED",
    },
  });
  await prisma.event.create({
    data: {
      title: "Career Readiness Workshop",
      slug: "career-workshop",
      description: "Resume clinics and mock interviews for final and pre-final year students.",
      startAt: new Date("2026-09-18T14:00:00+05:30"),
      endAt: new Date("2026-09-18T17:00:00+05:30"),
      location: "Business & Law Complex",
      venueNodeId: bySlug["business-law"].id,
      universityId: uni.id,
      sourceType: "USER",
      confidence: 0.8,
      status: "VERIFIED",
    },
  });

  await prisma.notice.create({
    data: {
      title: "Monsoon semester library hours update",
      slug: "library-hours-monsoon",
      body: "Central Library will operate 9:00–20:00 on weekdays during the monsoon semester. Weekend hours remain 10:00–16:00. Bring your student ID for entry.",
      previousBody:
        "Central Library operated 9:00–19:00 on weekdays. Weekend hours 10:00–16:00.",
      changeSummary: "Weekday closing time extended from 19:00 to 20:00.",
      category: "FACILITY",
      universityId: uni.id,
      ...OFFICIAL,
      sourceType: "USER",
      sourceTitle: "CampusOS demo notice",
      confidence: 0.7,
      status: "UNVERIFIED",
    },
  });
  await prisma.notice.create({
    data: {
      title: "SOET mid-semester assessment schedule released",
      slug: "soet-midsem-schedule",
      body: "Mid-semester assessments for SOET undergraduate programmes begin from 8 October 2026. Check Academic OS → Exams for your personalised list. No grades are published in CampusOS.",
      category: "ACADEMIC",
      universityId: uni.id,
      sourceType: "USER",
      confidence: 0.7,
      status: "UNVERIFIED",
    },
  });
  await prisma.notice.create({
    data: {
      title: "Campus Pulse: Sports Complex turf maintenance",
      slug: "sports-turf-maintenance",
      body: "The outdoor turf at the Sports Complex will have limited access on 12–13 September 2026 for maintenance. Indoor facilities remain open.",
      category: "CAMPUS",
      universityId: uni.id,
      sourceType: "USER",
      confidence: 0.7,
      status: "UNVERIFIED",
    },
  });

  await prisma.facility.create({
    data: {
      name: "Central Library",
      slug: "facility-library",
      type: "LIBRARY",
      description: "Reading rooms, digital resources, and academic support.",
      hours: "Weekdays 9:00–20:00 · Weekends 10:00–16:00",
      buildingId: bLib.id,
      universityId: uni.id,
      nodeId: bySlug["library-node"].id,
      ...OFFICIAL,
      confidence: 0.85,
    },
  });
  await prisma.facility.create({
    data: {
      name: "Food Court",
      slug: "facility-food",
      type: "FOOD",
      description: "Campus dining options near the central plaza.",
      hours: "8:00–21:00",
      universityId: uni.id,
      nodeId: bySlug["food-court"].id,
      sourceType: "USER",
      confidence: 0.7,
      status: "UNVERIFIED",
    },
  });
  await prisma.facility.create({
    data: {
      name: "Sports Complex",
      slug: "facility-sports",
      type: "SPORTS",
      description: "Indoor and outdoor sports & wellness facilities.",
      hours: "6:00–21:00",
      universityId: uni.id,
      nodeId: bySlug["sports-complex"].id,
      sourceType: "USER",
      confidence: 0.7,
      status: "UNVERIFIED",
    },
  });

  await prisma.hostel.create({
    data: {
      name: "Boys Hostel Block A",
      slug: "boys-hostel-a",
      type: "BOYS",
      description: "On-campus residential facility for male students (demo listing).",
      universityId: uni.id,
      sourceType: "USER",
      confidence: 0.6,
      status: "UNVERIFIED",
    },
  });
  await prisma.hostel.create({
    data: {
      name: "Girls Hostel Block A",
      slug: "girls-hostel-a",
      type: "GIRLS",
      description: "On-campus residential facility for female students (demo listing).",
      universityId: uni.id,
      sourceType: "USER",
      confidence: 0.6,
      status: "UNVERIFIED",
    },
  });

  await prisma.libraryResource.createMany({
    data: [
      {
        title: "Adamas University Official Website",
        type: "LINK",
        url: "https://adamasuniversity.ac.in/",
        description: "Primary institutional portal.",
        provider: "Adamas University",
        ...OFFICIAL,
      },
      {
        title: "Google Scholar",
        type: "DATABASE",
        url: "https://scholar.google.com/",
        description: "Scholarly literature search (external).",
        provider: "Google",
        sourceType: "SECONDARY",
        sourceTitle: "Google Scholar",
        sourceURL: "https://scholar.google.com/",
        confidence: 0.9,
        status: "VERIFIED",
      },
      {
        title: "DOAJ — Directory of Open Access Journals",
        type: "JOURNAL",
        url: "https://doaj.org/",
        description: "Open-access journal directory.",
        provider: "DOAJ",
        sourceType: "SECONDARY",
        sourceURL: "https://doaj.org/",
        sourceTitle: "DOAJ",
        confidence: 0.9,
        status: "VERIFIED",
      },
      {
        title: "arXiv",
        type: "DATABASE",
        url: "https://arxiv.org/",
        description: "Preprints in CS, physics, maths, and related fields.",
        provider: "Cornell Tech",
        sourceType: "SECONDARY",
        sourceURL: "https://arxiv.org/",
        sourceTitle: "arXiv",
        confidence: 0.9,
        status: "VERIFIED",
      },
    ],
  });

  await prisma.researchCenter.create({
    data: {
      name: "Centre for Emerging Technologies",
      slug: "cet",
      description: "Interdisciplinary research in AI, IoT, and applied computing (demo centre listing).",
      focus: "AI, IoT, Applied Computing",
      universityId: uni.id,
      sourceType: "USER",
      confidence: 0.6,
      status: "UNVERIFIED",
    },
  });

  await prisma.service.createMany({
    data: [
      {
        name: "Academic Records Request",
        slug: "academic-records",
        category: "Academics",
        description: "Request transcripts and academic certificates via the registrar desk.",
        howToAccess: "Visit Admin Block · Academic section during office hours.",
        hours: "Weekdays 10:00–16:00",
        universityId: uni.id,
        sourceType: "USER",
        confidence: 0.6,
        status: "UNVERIFIED",
      },
      {
        name: "ID Card Services",
        slug: "id-card",
        category: "Campus Life",
        description: "New and replacement student/staff ID cards.",
        howToAccess: "Admin Block reception.",
        hours: "Weekdays 10:00–15:00",
        universityId: uni.id,
        sourceType: "USER",
        confidence: 0.6,
        status: "UNVERIFIED",
      },
      {
        name: "Career Services Desk",
        slug: "career-services",
        category: "Career",
        description: "Placement coordination, counselling, and employer sessions.",
        howToAccess: "Business & Law Complex · Career cell.",
        hours: "Weekdays 10:00–17:00",
        universityId: uni.id,
        sourceType: "USER",
        confidence: 0.6,
        status: "UNVERIFIED",
      },
      {
        name: "IT Helpdesk",
        slug: "it-helpdesk",
        category: "Technology",
        description: "Campus network, email, and LMS support.",
        howToAccess: "Innovation Hub / SOET IT desk.",
        hours: "Weekdays 9:30–17:30",
        universityId: uni.id,
        sourceType: "USER",
        confidence: 0.6,
        status: "UNVERIFIED",
      },
    ],
  });

  await prisma.emergencyContact.create({
    data: {
      label: "Campus Security Desk",
      description:
        "For on-campus safety concerns, contact the campus security desk at the Main Gate / Admin Block. CampusOS does not publish unverified phone numbers.",
      contactHint: "Report in person at Main Gate security or Admin Block reception.",
      universityId: uni.id,
      sourceType: "USER",
      confidence: 0.7,
      status: "UNVERIFIED",
      sourceTitle: "CampusOS safety guidance",
    },
  });
  await prisma.emergencyContact.create({
    data: {
      label: "Medical assistance on campus",
      description:
        "Seek first aid via the Health Sciences / medical facility on campus. For life-threatening emergencies, call local emergency services (India: 112) — this is a national number, not a campus invention.",
      contactHint: "National emergency number 112 · Campus medical desk at Health Sciences block.",
      universityId: uni.id,
      sourceType: "SECONDARY",
      sourceURL: "https://www.india.gov.in/",
      sourceTitle: "National emergency services (India)",
      confidence: 0.9,
      status: "VERIFIED",
    },
  });

  await prisma.pulseStatus.createMany({
    data: [
      {
        area: "Central Library",
        status: "OPEN",
        message: "Operating on monsoon semester hours.",
        universityId: uni.id,
        updatedBy: "admin",
      },
      {
        area: "Sports Complex (turf)",
        status: "LIMITED",
        message: "Turf maintenance window 12–13 Sep; indoor open.",
        universityId: uni.id,
        updatedBy: "admin",
      },
      {
        area: "Food Court",
        status: "OPEN",
        message: "All counters active.",
        universityId: uni.id,
        updatedBy: "admin",
      },
      {
        area: "Main Gate",
        status: "OPEN",
        message: "Normal entry with ID.",
        universityId: uni.id,
        updatedBy: "admin",
      },
    ],
  });

  await prisma.globalClaim.create({
    data: {
      title: "Multi-disciplinary university at Adamas Knowledge City",
      claim:
        "Adamas University operates as a multi-disciplinary institution within Adamas Knowledge City in North 24 Parganas, West Bengal.",
      sourceURL: "https://adamasuniversity.ac.in/",
      sourceTitle: "Adamas University Official Website",
      sourceType: "OFFICIAL",
      retrievedAt: new Date("2026-09-01"),
      lastVerified: new Date("2026-09-01"),
      confidence: 0.95,
      status: "VERIFIED",
    },
  });
  await prisma.globalClaim.create({
    data: {
      title: "Internationalisation (general)",
      claim:
        "Like many Indian private universities, Adamas lists international collaboration and exchange as institutional priorities. Specific MoUs and partner lists should be verified on the official site before citing.",
      sourceURL: "https://adamasuniversity.ac.in/",
      sourceTitle: "Adamas University Official Website",
      sourceType: "SECONDARY",
      retrievedAt: new Date("2026-09-01"),
      confidence: 0.55,
      status: "UNVERIFIED",
    },
  });

  await prisma.notificationPref.createMany({
    data: [
      { key: "notices", label: "Academic & campus notices", enabled: true },
      { key: "events", label: "Events & club updates", enabled: true },
      { key: "exams", label: "Exam reminders", enabled: true },
      { key: "pulse", label: "Campus Pulse changes", enabled: true },
      { key: "career", label: "Career opportunities", enabled: false },
    ],
  });

  await prisma.favorite.createMany({
    data: [
      { studentId: student.id, itemType: "course", itemId: courseAI.id, label: "Artificial Intelligence" },
      { studentId: student.id, itemType: "node", itemId: bySlug["soet-block"].id, label: "SOET Block" },
      { studentId: student.id, itemType: "club", itemId: robotics.id, label: "Robotics and AI Club" },
      { studentId: student.id, itemType: "facility", itemId: (await prisma.facility.findFirstOrThrow({ where: { slug: "facility-library" } })).id, label: "Central Library" },
    ],
  });

  await prisma.ideaSubmission.create({
    data: {
      title: "Smart queue boards for Food Court",
      description:
        "Display live counter wait estimates on screens near the Food Court entrance to reduce crowding at peak hours.",
      category: "Campus Operations",
      submitterName: "Aarav Sen (demo)",
      status: "RECEIVED",
    },
  });

  console.log("Seed complete.");
  console.log(`University: ${uni.name}`);
  console.log(`Demo student: Aarav Sen (${student.id})`);
  console.log(`Schools: ${schoolRecords.length} · Clubs: ${CLUBS.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
