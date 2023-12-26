'use server';

import { getSession } from './auth';
import { prisma } from './prisma';

export const createForm = async () => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  const response = await prisma.form.create({
    data: {
      userId: session.user.id,
      title: '',
    },
  });

  return response;
};

export const getFormsFromUser = async () => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  const response = await prisma.form.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return response;
};

export const getFormFromUser = async (formId: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  const response = await prisma.form.findFirst({
    where: {
      userId: session.user.id,
      id: formId,
    },
  });

  return response;
};

export const createQuestion = async (formId: string) => {
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
  const response = await prisma.question.create({
    data: {
      userId: session.user.id,
      formId: fromFromUser.id,
    },
  });

  return response;
};

export const getQuestionsFromUser = async (formId: string) => {
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

  const response = await prisma.question.findMany({
    where: {
      formId: fromFromUser.id,
      userId: session.user.id,
    },
  });

  return response;
};
