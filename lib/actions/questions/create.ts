'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const createOptionQuestion = async (
  formId: string,
  questionOrder: number
) => {
  const session = await getSession();

  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  await prisma.form.findFirstOrThrow({
    where: {
      id: formId,
      userId: session.user.id,
    },
  });

  const questions = await prisma.question.findMany({
    where: {
      formId,
      order: {
        gte: questionOrder,
      },
    },
    orderBy: {
      order: 'asc',
    },
  });

  const updateOperations = questions.map((question) => {
    const newOrder = question.order + 1;
    return prisma.question.update({
      where: { id: question.id, formId },
      data: { order: newOrder },
    });
  });

  const createQuestionFunction = prisma.question.create({
    data: {
      userId: session.user.id,
      formId,
      order: questionOrder,
      type: 'MANY_OPTIONS',
      options: {
        create: [{ order: 1, optionText: 'option 1' }],
      },
    },
  });

  updateOperations.push(createQuestionFunction);

  await prisma.$transaction(updateOperations);

  revalidatePath(`/forms/${formId}`);

  return;
};

export const createShortResponseQuestion = async (
  formId: string,
  questionOrder: number
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  const fromFromUser = await prisma.form.findFirst({
    where: {
      id: formId,
    },
  });
  if (!fromFromUser) {
    return {
      error: 'Form does not exit',
    };
  }

  if (fromFromUser.userId !== session.user.id) {
    return {
      error: 'Form is not not from the user',
    };
  }

  const questions = await prisma.question.findMany({
    where: {
      formId,
      order: {
        gte: questionOrder,
      },
    },
    orderBy: {
      order: 'asc',
    },
  });

  const updateOperations = questions.map((question) => {
    const newOrder = question.order + 1;
    return prisma.question.update({
      where: {
        id: question.id,
        formId,
      },
      data: {
        order: newOrder,
      },
    });
  });

  const createFunction = prisma.question.create({
    data: {
      userId: session.user.id,
      formId,
      order: questionOrder,
      type: 'SHORT_RESPONSE',
    },
  });

  updateOperations.push(createFunction);

  await prisma.$transaction(updateOperations);

  revalidatePath(`/forms/${formId}`);

  return;
};
