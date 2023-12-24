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

