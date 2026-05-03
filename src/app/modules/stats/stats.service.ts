import status from "http-status";
import { ApplicationStatus, PaymentStatus, Role, UserStatus } from "../../../generated/prisma/index.js";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.inteface";
import { prisma } from "../../lib/prisma";

const getDashboardStatsData = async (user: IRequestUser) => {
    let statsData;

    switch (user.role) {
        case Role.SUPER_ADMIN:
            statsData = getSuperAdminStatsData();
            break;
        case Role.ADMIN:
            statsData = getAdminStatsData();
            break;
        default:
            throw new AppError(status.BAD_REQUEST, "Invalid user role");
    }

    return statsData;
}

const getSuperAdminStatsData = async () => {
    const paidApplicantCount = await prisma.application.count({
        where: {
            paymentStatus: PaymentStatus.PAID
        }
    });

    const unpaidApplicantCount = await prisma.application.count({
        where: {
            paymentStatus: PaymentStatus.UNPAID
        }
    });

    const rejectedApplicantCount = await prisma.application.count({
        where: {
            status: ApplicationStatus.REJECTED
        }
    });

    const approvedApplicantCount = await prisma.application.count({
        where: {
            status: ApplicationStatus.APPROVED
        }
    });

    const pendingApplicantCount = await prisma.application.count({
        where: {
            status: ApplicationStatus.PENDING
        }
    });


    const superAdminCount = await prisma.admin.count({
        where: {
            user: {
                role: Role.SUPER_ADMIN
            }
        }
    });
    const successPaymentCount = await prisma.payment.count({
        where: {
            status: PaymentStatus.PAID
        }
    });

    const unpaidPaymentCount = await prisma.payment.count({
        where: {
            status: PaymentStatus.UNPAID
        }
    });

    const activeAdminCount = await prisma.admin.count({
        where: {
            isDeleted: false,
        }
    });

    const inactiveAdminCount = await prisma.admin.count({
        where: {
            isDeleted: true,
        }
    });

    const activeTeacherCount = await prisma.teacher.count({
        where: {
            isDeleted: false,

        }
    });


    const inactiveTeacherCount = await prisma.teacher.count({
        where: {
            isDeleted: true,

        }
    });

    const activeUserCount = await prisma.user.count({
        where: {

            status: UserStatus.ACTIVE
        }
    });

    const inactiveUserCount = await prisma.user.count({
        where: {

            status: UserStatus.INACTIVE
        }
    });

    const suspendedUserCount = await prisma.user.count({
        where: {

            status: UserStatus.SUSPENDED
        }
    });

    const totalRevenue = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
            status: PaymentStatus.PAID
        }
    });

    const pieChartData = await getPieChartData();
    const barChartData = await getBarChartData();

    return {
        applicantStats: {
            paidApplicantCount,
            unpaidApplicantCount,
            approvedApplicantCount,
            pendingApplicantCount,
            rejectedApplicantCount
        },
        paymentStats: {
            successPaymentCount,
            unpaidPaymentCount
        },
        userStats: {
            activeAdminCount,
            inactiveAdminCount,
            activeTeacherCount,
            inactiveTeacherCount,
            activeUserCount,
            inactiveUserCount,
            suspendedUserCount
        },
        totalRevenue: totalRevenue._sum.amount || 0,
        pieChartData,
        barChartData

    }
}

const getAdminStatsData = async () => {
    const paidApplicantCount = await prisma.application.count({
        where: {
            paymentStatus: PaymentStatus.PAID
        }
    });

    const unpaidApplicantCount = await prisma.application.count({
        where: {
            paymentStatus: PaymentStatus.UNPAID
        }
    });

    const rejectedApplicantCount = await prisma.application.count({
        where: {
            status: ApplicationStatus.REJECTED
        }
    });

    const approvedApplicantCount = await prisma.application.count({
        where: {
            status: ApplicationStatus.APPROVED
        }
    });

    const pendingApplicantCount = await prisma.application.count({
        where: {
            status: ApplicationStatus.PENDING
        }
    });

    const successPaymentCount = await prisma.payment.count({
        where: {
            status: PaymentStatus.PAID
        }
    });

    const unpaidPaymentCount = await prisma.payment.count({
        where: {
            status: PaymentStatus.UNPAID
        }
    });

    const activeAdminCount = await prisma.admin.count({
        where: {
            isDeleted: false,
        }
    });

    const inactiveAdminCount = await prisma.admin.count({
        where: {
            isDeleted: true,
        }
    });

    const activeTeacherCount = await prisma.teacher.count({
        where: {
            isDeleted: false,

        }
    });


    const inactiveTeacherCount = await prisma.teacher.count({
        where: {
            isDeleted: true,

        }
    });

    const activeUserCount = await prisma.user.count({
        where: {

            status: UserStatus.ACTIVE
        }
    });

    const inactiveUserCount = await prisma.user.count({
        where: {

            status: UserStatus.INACTIVE
        }
    });

    const suspendedUserCount = await prisma.user.count({
        where: {

            status: UserStatus.SUSPENDED
        }
    });

    const totalRevenue = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
            status: PaymentStatus.PAID
        }
    });

    const pieChartData = await getPieChartData();
    const barChartData = await getBarChartData();

    return {
        applicantStats: {
            paidApplicantCount,
            unpaidApplicantCount,
            approvedApplicantCount,
            pendingApplicantCount,
            rejectedApplicantCount
        },
        paymentStats: {
            successPaymentCount,
            unpaidPaymentCount
        },
        userStats: {
            activeAdminCount,
            inactiveAdminCount,
            activeTeacherCount,
            inactiveTeacherCount,
            activeUserCount,
            inactiveUserCount,
            suspendedUserCount
        },
        totalRevenue: totalRevenue._sum.amount || 0,
        pieChartData,
        barChartData

    }
}









const getPieChartData = async () => {
    const applicationStatusDistribution = await prisma.application.groupBy({
        by: ["status"],
        _count: {
            id: true
        }
    });

    const formattedApplicationStatusDistribution = applicationStatusDistribution.map(({ _count, status }) => ({
        status,
        count: _count.id
    }))

    return formattedApplicationStatusDistribution;
}

const getBarChartData = async () => {
    interface ApplicationCountByMonth {
        month: Date;
        count: bigint;
    }
    const applicationCountByMonth: ApplicationCountByMonth[] = await prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "createdAt") AS month,
        CAST(COUNT(*) AS INTEGER) AS count
        FROM "application"
        GROUP BY month
        ORDER BY month ASC;
    `

    return applicationCountByMonth
}

export const StatsService = {
    getDashboardStatsData
}
