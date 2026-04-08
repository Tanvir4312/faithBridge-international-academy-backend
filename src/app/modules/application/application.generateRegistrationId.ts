/* eslint-disable @typescript-eslint/no-explicit-any */


export const generateRegistrationId = async (tx: any) => {
  const currentYear = new Date().getFullYear();


  const lastStudent = await tx.student.findFirst({
    where: {
      registrationId: {
        startsWith: `${currentYear}`,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });


  let lastIdNumber = 0;
  if (lastStudent) {
    const lastIdStr = lastStudent.registrationId.substring(4); // '20260005' থেকে '0005' নেওয়া
    lastIdNumber = parseInt(lastIdStr);
  }

  const nextIdNumber = (lastIdNumber + 1).toString().padStart(4, "0");
  return `${currentYear}${nextIdNumber}`;
};

