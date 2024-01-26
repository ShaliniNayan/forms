'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from './auth';
import { prisma } from './prisma';
import { response } from 'express';
import { redirect } from 'next/navigation';

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

export const updateFormFromUser = async (formId: string, title: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  const response = await prisma.form.update({
    where: {
      id: formId,
      userId: session.user.id,
    },
    data: {
      title,
    },
  });
  revalidatePath(`/forms/${formId}`);
  return response;
};

export const updateQuestionFromUser = async (
  formId: string,
  questionId: string,
  placeholder: string | null,
  text: string | null
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }
  if (text !== null && placeholder !== null) {
    const response = await prisma.question.update({
      where: {
        formId,
        id: questionId,
        userId: session.user.id,
      },
      data: {
        text,
        placeholder,
      },
    });
    revalidatePath(`/forms/${formId}`);
    return response;
  } else if (text !== null) {
    const response = await prisma.question.update({
      where: {
        formId,
        id: questionId,
        userId: session.user.id,
      },
      data: {
        text,
      },
    });
    revalidatePath(`/forms/${formId}`);
    return response;
  } else if (placeholder !== null) {
    const response = await prisma.question.update({
      where: {
        formId,
        id: questionId,
        userId: session.user.id,
      },
      data: {
        placeholder,
      },
    });
    revalidatePath(`/forms/${formId}`);
    return response;
  }
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

export const createQuestion = async (formId: string, questionOrder: number) => {
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
    },
  });

  updateOperations.push(createFunction);

  await prisma.$transaction(updateOperations);

  revalidatePath(`/forms/${formId}`);

  return;
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
    orderBy: {
      order: 'asc',
    },
  });

  revalidatePath(`/forms/${formId}`);

  return response;
};

export const deleteQuestion = async (formId: string, questionId: string) => {
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

  const questionToDelete = await prisma.question.findFirst({
    where: {
      id: questionId,
    },
  });

  if (!questionToDelete) {
    return {
      error: 'Question does not exit',
    };
  }

  if (questionToDelete.formId != formId) {
    return {
      error: 'Given question is not from the given form Id',
    };
  }

  const questions = await prisma.question.findMany({
    where: {
      formId,
      order: {
        gte: questionToDelete.order,
      },
    },
    orderBy: {
      order: 'asc',
    },
  });

  const updateOperations = questions.map((question) => {
    const newOrder = question.order - 1;
    return prisma.question.update({
      where: { id: question.id, formId },
      data: { order: newOrder },
    });
  });

  const deleteFunction = prisma.question.delete({
    where: {
      id: questionId,
    },
  });

  updateOperations.push(deleteFunction);

  await prisma.$transaction(updateOperations);

  revalidatePath(`forms/${formId}`);

  return;
};

export const togglePublishFormFromUser = async (formId: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  const form = await prisma.form.findFirstOrThrow({
    where: {
      id: formId,
      userId: session.user.id,
    },
  });

  const response = await prisma.form.update({
    where: {
      id: formId,
      userId: session.user.id,
    },
    data: {
      published: !form.published,
    },
  });

  revalidatePath(`/forms/${formId}`);
  return response;
};

export const getForm = async (formId: string) => {
  const response = await prisma.form.findFirst({
    where: {
      id: formId,
    },
  });

  if (!response) {
    redirect('/forms/e');
  }

  if (!response.published) {
    redirect('/forms/e');
  }

  return response;
};

function transform(obj: any) {
  const result = [];
  for (let key in obj) {
    result.push({
      answerText: obj[key],
      questionId: key,
    });
  }

  return result;
}

export const submitForm = async (answerHash: string, formId: string) => {
  const answers = transform(answerHash);

  const form = await prisma.form.findFirstOrThrow({
    where: {
      id: formId,
    },
  });

  answers.map(async (answer) => {
    const question = await prisma.question.findFirstOrThrow({
      where: {
        id: answer.questionId,
      },
    });

    if (question.formId !== formId) {
      throw new Error();
    }
    return answer;
  });

  const response = await prisma.response.create({
    data: {
      submittedAt: new Date().toISOString(),
    },
  });

  const createAnswerOperations = answers.map((answer) => {
    return prisma.answer.create({
      data: {
        responseId: response.id,
        questionId: answer.questionId,
        answerText: answer.answerText,
        formId: form.id,
      },
    });
  });

  await prisma.$transaction(createAnswerOperations);

  return;
};

export const getResponsesSummaryFromUser = async (formId: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  const questions = await prisma.question.findMany({
    where: {
      formId: formId,
    },
    include: {
      answers: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  });

  return questions;
};

export const checkIfUserIsLoggedIn = async () => {
  const session = await getSession();
  if (!session?.user.id) {
    return false;
  }
  return true;
};
