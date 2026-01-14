import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar cursos
  const course1 = await prisma.course.create({
    data: {
      name: 'TypeScript Avançado',
      description: 'Aprenda TypeScript do zero ao avançado',
      instructor: 'João Silva',
      duration: 40,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      name: 'Node.js e Express',
      description: 'Construa APIs RESTful com Node.js',
      instructor: 'Maria Santos',
      duration: 35,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      name: 'Banco de Dados com Prisma',
      description: 'ORM moderno para Node.js',
      instructor: 'Pedro Costa',
      duration: 25,
    },
  });

  // Criar estudantes
  const student1 = await prisma.student.create({
    data: {
      name: 'Ana Paula',
      email: 'ana@example.com',
      phone: '(11) 98888-7777',
    },
  });

  const student2 = await prisma.student.create({
    data: {
      name: 'Carlos Eduardo',
      email: 'carlos@example.com',
      phone: '(11) 97777-6666',
    },
  });

  // Criar matrículas
  await prisma.enrollment.create({
    data: {
      studentId: student1.id,
      courseId: course1.id,
      status: 'active',
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: student2.id,
      courseId: course2.id,
      status: 'active',
    },
  });

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
