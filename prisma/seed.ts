import { PrismaClient, Role } from "@prisma/client";
import { DEMO_USER_EMAIL } from "../lib/demo-user";

const prisma = new PrismaClient();

/**
 * Deterministic quiz history so the leaderboard and adaptive recommendations
 * have something to read. Each entry is [email, capsulesAttempted, scoreOutOf3].
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

async function main() {
  await prisma.quizResult.deleteMany();
  await prisma.question.deleteMany();
  await prisma.capsule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      { name: "Youssef Nabil", email: "youssef@lumina.local", points: 3120 },
      { name: "Amira Hassan", email: DEMO_USER_EMAIL, points: 2480 },
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

  await prisma.course.create({
    data: {
      title: "الرياضيات",
      description: "مسار البكالوريا في التحليل والجبر والاحتمالات.",
      capsules: {
        create: [
          {
            title: "المشتقات الأساسية",
            videoUrl: "https://www.youtube.com/watch?v=WUvTyaaNkzY",
            duration: 15,
            questions: {
              create: [
                {
                  text: "ما مشتقة الدالة f(x) = 3x² − 4x + 1؟",
                  options: ["6x − 4", "3x − 4", "6x + 4", "3x² − 4"],
                  correctAnswer: "A",
                  explanation:
                    "مشتقة x² هي 2x، فتصبح 6x، ومشتقة −4x هي −4.",
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
              ],
            },
          },
          {
            title: "الاحتمالات: الأحداث المستقلة",
            videoUrl: "https://www.youtube.com/watch?v=uzkc-qNVoOk",
            duration: 15,
            questions: {
              create: [
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
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.course.create({
    data: {
      title: "الفيزياء",
      description: "مسار البكالوريا في الميكانيك والكهرباء.",
      capsules: {
        create: [
          {
            title: "قوانين نيوتن للحركة",
            videoUrl: "https://www.youtube.com/watch?v=kKKM8Y-u1dw",
            duration: 15,
            questions: {
              create: [
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
              ],
            },
          },
          {
            title: "التيار الكهربائي والمقاومة",
            videoUrl: "https://www.youtube.com/watch?v=7vummgcK2BQ",
            duration: 15,
            questions: {
              create: [
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
                  explanation:
                    "على التوازي: 1/Req = 1/4 + 1/4 = 1/2، إذن Req = 2 Ω.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  await seedHistory();
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
