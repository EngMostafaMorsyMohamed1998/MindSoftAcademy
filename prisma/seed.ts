import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";
import { DEMO_USER_EMAIL } from "../lib/demo-user";

const prisma = new PrismaClient();

type SeedQuestion = {
  text: string;
  options: string[];
  /** "A" | "B" | "C" | "D" matching options[0–3]. */
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
};

type SeedCapsule = {
  title: string;
  /** YouTube lesson or official PDF path under /books. */
  videoUrl: string;
  duration: number;
  questions: SeedQuestion[];
};

type SeedCourse = {
  title: string;
  description: string;
  capsules: SeedCapsule[];
};

/**
 * 2bac curriculum: existing Maths/Physics capsules, the official
 * Programming & AI textbooks, plus English Language.
 */
const COURSES: SeedCourse[] = [
  {
    title: "الرياضيات",
    description: "مسار البكالوريا في التحليل والجبر والاحتمالات.",
    capsules: [
      {
        title: "المشتقات الأساسية",
        videoUrl: "https://www.youtube.com/watch?v=WUvTyaaNkzY",
        duration: 15,
        questions: [
          {
            text: "ما مشتقة الدالة f(x) = 3x² − 4x + 1؟",
            options: ["6x − 4", "3x − 4", "6x + 4", "3x² − 4"],
            correctAnswer: "A",
            explanation: "مشتقة x² هي 2x، فتصبح 6x، ومشتقة −4x هي −4.",
          },
          {
            text: "إذا كانت f دالة قابلة للاشتقاق، فماذا تمثل f'(a) هندسيًا؟",
            options: [
              "مساحة المنطقة تحت المنحنى",
              "ميل المماس عند x = a",
              "نقطة تقاطع المنحنى مع محور العينات",
              "طول القوس من 0 إلى a",
            ],
            correctAnswer: "B",
            explanation:
              "العدد المشتق عند نقطة هو ميل المستقيم المماس للمنحنى عند تلك النقطة.",
          },
          {
            text: "مشتقة الدالة الثابتة f(x) = 7 تساوي:",
            options: ["7", "7x", "0", "1"],
            correctAnswer: "C",
            explanation: "مشتقة أي ثابت تساوي صفرًا.",
          },
          {
            text: "مشتقة sin(x) تساوي:",
            options: ["−cos(x)", "tan(x)", "cos(x)", "−sin(x)"],
            correctAnswer: "C",
            explanation: "هذه قاعدة الاشتقاق الأساسية للدالة الجيبية.",
          },
        ],
      },
      {
        title: "الاحتمالات: الأحداث المستقلة",
        videoUrl: "https://www.youtube.com/watch?v=uzkc-qNVoOk",
        duration: 15,
        questions: [
          {
            text: "رُميت قطعتا نقد عادلتان مستقلتان. ما احتمال ظهور صورتين؟",
            options: ["1/2", "1/3", "1/4", "1/8"],
            correctAnswer: "C",
            explanation:
              "احتمال الصورة في كل رمية 1/2، والاستقلال يعطي (1/2)×(1/2) = 1/4.",
          },
          {
            text: "كيس فيه 3 كرات حمراء وكرتان زرقاوان. تُسحب كرة عشوائيًا. ما احتمال أن تكون حمراء؟",
            options: ["2/5", "3/5", "1/2", "3/2"],
            correctAnswer: "B",
            explanation: "عدد النتائج المواتية 3 من أصل 5 كرات.",
          },
          {
            text: "إذا كان P(A) = 0.4 وP(B) = 0.5 وكان A وB مستقلين، فإن P(A ∩ B) يساوي:",
            options: ["0.9", "0.1", "0.2", "0.54"],
            correctAnswer: "C",
            explanation: "للاستقلال: P(A ∩ B) = P(A)×P(B) = 0.20.",
          },
          {
            text: "حدثان متكاملان A وĀ. إذا كان P(A) = 0.35 فإن P(Ā) يساوي:",
            options: ["0.35", "0.65", "1.35", "0"],
            correctAnswer: "B",
            explanation: "P(Ā) = 1 − P(A) = 0.65.",
          },
        ],
      },
    ],
  },
  {
    title: "الفيزياء",
    description: "مسار البكالوريا في الميكانيك والكهرباء.",
    capsules: [
      {
        title: "قوانين نيوتن للحركة",
        videoUrl: "https://www.youtube.com/watch?v=kKKM8Y-u1dw",
        duration: 15,
        questions: [
          {
            text: "ينص القانون الأول لنيوتن على أن الجسم:",
            options: [
              "يتسارع دائمًا في اتجاه القوة",
              "يبقى على حالته من السكون أو الحركة المنتظمة ما لم تؤثر عليه قوة محصلة",
              "قوة رد الفعل تساوي القوة المؤثرة وتعاكسها",
              "التسارع يتناسب عكسيًا مع الكتلة فقط",
            ],
            correctAnswer: "B",
            explanation:
              "هذا هو مبدأ العطالة: لا يتغير شعاع السرعة إلا بقوة محصلة غير معدومة.",
          },
          {
            text: "وحدة القوة في الجملة الدولية هي:",
            options: ["الجول", "الواط", "الباسكال", "النيوتن"],
            correctAnswer: "D",
            explanation: "النيوتن (N) هو وحدة القوة، ويساوي kg·m/s².",
          },
          {
            text: "جسم كتلته 2 kg تؤثر عليه قوة محصلة 10 N. تسارعه يساوي:",
            options: ["5 m/s²", "8 m/s²", "12 m/s²", "20 m/s²"],
            correctAnswer: "A",
            explanation: "من القانون الثاني: a = F/m = 10/2 = 5 m/s².",
          },
          {
            text: "القانون الثالث لنيوتن يعني أن:",
            options: [
              "الوزن يساوي الكتلة",
              "لكل فعل رد فعل مساوٍ له في المقدار ومعاكس له في الاتجاه",
              "التسارع ثابت دائمًا",
              "القوة لا تعمل عن بعد",
            ],
            correctAnswer: "B",
            explanation: "قوتا الفعل ورد الفعل متساويتان ومتعاكستان.",
          },
        ],
      },
      {
        title: "التيار الكهربائي والمقاومة",
        videoUrl: "https://www.youtube.com/watch?v=7vummgcK2BQ",
        duration: 15,
        questions: [
          {
            text: "ينص قانون أوم على أن:",
            options: ["U = R / I", "U = R × I", "P = R × I", "I = R × U"],
            correctAnswer: "B",
            explanation:
              "التوتر بين طرفي ناقل أومي يساوي جداء المقاومة في شدة التيار.",
          },
          {
            text: "وحدة المقاومة الكهربائية هي:",
            options: ["الأوم", "الفولط", "الأمبير", "الكولوم"],
            correctAnswer: "A",
            explanation: "الأوم (Ω) هو وحدة المقاومة.",
          },
          {
            text: "مقاومتان 4 Ω و4 Ω موصولتان على التوازي. المقاومة المكافئة تساوي:",
            options: ["8 Ω", "4 Ω", "2 Ω", "1 Ω"],
            correctAnswer: "C",
            explanation: "على التوازي: 1/Req = 1/4 + 1/4 = 1/2، إذن Req = 2 Ω.",
          },
          {
            text: "شدة التيار عبر مقاومة 10 Ω تحت توتر 20 V تساوي:",
            options: ["0.5 A", "2 A", "10 A", "200 A"],
            correctAnswer: "B",
            explanation: "I = U/R = 20/10 = 2 A.",
          },
        ],
      },
    ],
  },
  {
    title: "Programming and Artificial Intelligence",
    description:
      "Official 2bac Engineering & Computer Science textbooks (ministry PDFs, parts 1–2).",
    capsules: [
      {
        title: "Programming & AI — student book part 1",
        videoUrl: "/books/programming-ai-en-part1.pdf",
        duration: 15,
        questions: [
          {
            text: "In the Egyptian Baccalaureate track, Programming and AI belongs to:",
            options: [
              "Literature and Languages",
              "Engineering and Computer Science",
              "Medicine and Life Sciences",
              "Business and Management",
            ],
            correctAnswer: "B",
            explanation:
              "The ministry lists this subject under الهندسة وعلوم الحاسب.",
          },
          {
            text: "A program that follows a finite sequence of well-defined steps is using:",
            options: ["a heuristic", "an algorithm", "a neural weight", "a prompt"],
            correctAnswer: "B",
            explanation: "An algorithm is a finite, unambiguous sequence of steps.",
          },
          {
            text: "Which pair is a valid input–process–output example?",
            options: [
              "Screen → keyboard → memory only",
              "Two numbers → add them → their sum",
              "Compiler → printer → source file",
              "Wi-Fi → algorithm → mouse",
            ],
            correctAnswer: "B",
            explanation:
              "Inputs are the numbers, the process is addition, the output is the sum.",
          },
          {
            text: "Python uses indentation mainly to:",
            options: [
              "speed up the interpreter",
              "mark comments",
              "group statements in a block",
              "declare variable types",
            ],
            correctAnswer: "C",
            explanation:
              "Indentation defines blocks such as if, for, and function bodies.",
          },
          {
            text: "The official part-1 textbook PDF in this platform is served from:",
            options: [
              "/books/programming-ai-en-part1.pdf",
              "/api/books/part1",
              "https://youtube.com/playlist",
              "/public/ai.docx",
            ],
            correctAnswer: "A",
            explanation:
              "Ministry PDFs are stored under public/books and served from /books/.",
          },
        ],
      },
      {
        title: "Programming & AI — student book part 2",
        videoUrl: "/books/programming-ai-en-part2.pdf",
        duration: 15,
        questions: [
          {
            text: "A model that learns patterns from labelled examples is doing:",
            options: [
              "supervised learning",
              "manual sorting only",
              "DNS routing",
              "lossy compression",
            ],
            correctAnswer: "A",
            explanation:
              "Supervised learning trains on input–label pairs.",
          },
          {
            text: "Which statement about training data is safest?",
            options: [
              "More biased data always improves accuracy",
              "Quality and representativeness matter as much as size",
              "Labels are never needed",
              "Test data should be copied into the training set",
            ],
            correctAnswer: "B",
            explanation:
              "Biased or leaky data produces models that fail on real exams and tasks.",
          },
          {
            text: "A neural network weight is best described as:",
            options: [
              "the student's points on the leaderboard",
              "a parameter the model adjusts while learning",
              "a PDF page number",
              "a Wi-Fi password",
            ],
            correctAnswer: "B",
            explanation:
              "Weights are numeric parameters updated during training.",
          },
          {
            text: "Using an AI tutor honestly means you should:",
            options: [
              "paste the full mark scheme and ask it to invent scores",
              "treat it as a study aid and check answers against the syllabus",
              "disable all explanations",
              "submit its raw output as your official exam",
            ],
            correctAnswer: "B",
            explanation:
              "Lumina's tutor stays inside the official syllabus; students still verify.",
          },
        ],
      },
    ],
  },
  {
    title: "English Language",
    description:
      "2bac English: academic reading, core grammar, and exam-style vocabulary.",
    capsules: [
      {
        title: "Reading: academic paragraphs",
        videoUrl: "https://www.youtube.com/watch?v=1k4pFkt1Hrs",
        duration: 15,
        questions: [
          {
            text: "The main idea of a paragraph is usually found:",
            options: [
              "only in the last footnote",
              "in the topic sentence, often near the start",
              "in every adjective",
              "in the page number",
            ],
            correctAnswer: "B",
            explanation:
              "The topic sentence states the controlling idea; details support it.",
          },
          {
            text: "A synonym for 'significant' in an academic text is closest to:",
            options: ["tiny", "important", "accidental", "silent"],
            correctAnswer: "B",
            explanation: "Significant means important or noteworthy.",
          },
          {
            text: "What is a supporting detail?",
            options: [
              "A sentence that repeats the title only",
              "Evidence or example that develops the main idea",
              "The author's signature",
              "A word with no meaning",
            ],
            correctAnswer: "B",
            explanation:
              "Facts, examples, and explanations hold up the main idea.",
          },
          {
            text: "Skimming a text means you:",
            options: [
              "read every word aloud twice",
              "look quickly for the general idea",
              "translate each sentence first",
              "ignore the title and headings",
            ],
            correctAnswer: "B",
            explanation:
              "Skimming is a fast pass for gist; scanning hunts a specific fact.",
          },
          {
            text: "'However' in mid-argument most often signals:",
            options: [
              "a contrast or change of direction",
              "a list of dates",
              "the end of the exam",
              "a spelling rule",
            ],
            correctAnswer: "A",
            explanation:
              "Contrast markers (however, although, whereas) flip or qualify the claim.",
          },
        ],
      },
      {
        title: "Grammar: conditionals and reported speech",
        videoUrl: "https://www.youtube.com/watch?v=v_O0qL8fGbQ",
        duration: 15,
        questions: [
          {
            text: "If she studies tonight, she ____ the quiz.",
            options: ["pass", "passes", "will pass", "passed"],
            correctAnswer: "C",
            explanation:
              "First conditional: if + present, will + base verb.",
          },
          {
            text: "If I ____ more time, I would revise probability.",
            options: ["have", "had", "has", "will have"],
            correctAnswer: "B",
            explanation:
              "Second conditional: if + past, would + base verb.",
          },
          {
            text: "He said, \"I am tired.\" → He said that he ____ tired.",
            options: ["am", "is", "was", "be"],
            correctAnswer: "C",
            explanation:
              "Reported speech usually backshifts present simple to past simple.",
          },
          {
            text: "Choose the correct reported question:",
            options: [
              "She asked me where was the library.",
              "She asked me where the library was.",
              "She asked me where is the library?",
              "She asked me the library where.",
            ],
            correctAnswer: "B",
            explanation:
              "Embedded questions use statement order: where + subject + verb.",
          },
        ],
      },
    ],
  },
];

/**
 * Deterministic quiz history so the leaderboard and adaptive recommendations
 * have something to read. Each entry is [email, capsulesAttempted, scoreOutOfN].
 */
const HISTORY: [string, number, number][] = [
  ["youssef@lumina.local", 4, 3],
  [DEMO_USER_EMAIL, 3, 2],
  ["leila@lumina.local", 3, 3],
  ["omar@lumina.local", 3, 2],
  ["nora@lumina.local", 2, 2],
  ["hana@lumina.local", 2, 3],
  ["karim@lumina.local", 2, 1],
  ["mariam@lumina.local", 1, 2],
  ["tarek@lumina.local", 1, 1],
  ["salma@lumina.local", 1, 3],
];

async function seedHistory() {
  const capsules = await prisma.capsule.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, _count: { select: { questions: true } } },
  });
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  const idByEmail = new Map(users.map((user) => [user.email, user.id]));

  const attempts = HISTORY.flatMap(([email, capsuleCount, score]) => {
    const userId = idByEmail.get(email);
    if (!userId) return [];

    return capsules.slice(0, capsuleCount).map((capsule) => ({
      userId,
      capsuleId: capsule.id,
      score: Math.min(score, capsule._count.questions),
      totalQuestions: capsule._count.questions,
    }));
  });

  await prisma.quizResult.createMany({ data: attempts });
}

async function seedCourses() {
  for (const course of COURSES) {
    await prisma.course.create({
      data: {
        title: course.title,
        description: course.description,
        capsules: {
          create: course.capsules.map((capsule) => ({
            title: capsule.title,
            videoUrl: capsule.videoUrl,
            duration: capsule.duration,
            questions: {
              create: capsule.questions,
            },
          })),
        },
      },
    });
  }
}

async function main() {
  await prisma.quizResult.deleteMany();
  await prisma.question.deleteMany();
  await prisma.capsule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  const demoPassword = process.env.DEMO_USER_PASSWORD ?? "lumina-demo";
  const demoPasswordHash = await bcrypt.hash(demoPassword, 10);

  await prisma.user.createMany({
    data: [
      { name: "Youssef Nabil", email: "youssef@lumina.local", points: 3120 },
      {
        name: "Amira Hassan",
        email: DEMO_USER_EMAIL,
        points: 2480,
        passwordHash: demoPasswordHash,
        image:
          "https://api.dicebear.com/9.x/initials/svg?seed=Amira%20Hassan",
      },
      { name: "Leila Kamal", email: "leila@lumina.local", points: 2410 },
      { name: "Omar Sabry", email: "omar@lumina.local", points: 2195 },
      { name: "Nora Bahgat", email: "nora@lumina.local", points: 1980 },
      { name: "Hana Fouad", email: "hana@lumina.local", points: 1760 },
      { name: "Karim Adel", email: "karim@lumina.local", points: 1540 },
      { name: "Mariam Zaki", email: "mariam@lumina.local", points: 1315 },
      { name: "Tarek Sami", email: "tarek@lumina.local", points: 980 },
      { name: "Salma Ezz", email: "salma@lumina.local", points: 720 },
      { name: "Dina Roshdy", email: "dina@lumina.local", points: 415 },
      {
        name: "Mostafa Morsy",
        email: "admin@lumina.local",
        role: Role.ADMIN,
        points: 0,
      },
    ],
  });

  await seedCourses();
  await seedHistory();

  const [courseCount, capsuleCount, questionCount] = await Promise.all([
    prisma.course.count(),
    prisma.capsule.count(),
    prisma.question.count(),
  ]);
  console.log(
    `Seeded ${courseCount} courses, ${capsuleCount} capsules, ${questionCount} questions.`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
