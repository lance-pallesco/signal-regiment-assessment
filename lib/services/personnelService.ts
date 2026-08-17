import { prisma } from "@/lib/prisma";
import { PersonnelInput, OFFICER_RANKS } from "@/lib/validations/personnel";
import { Prisma } from "@prisma/client";

export interface GetPersonnelQueryParams {
  search?: string;
  unit?: string;
  rank?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: "id" | "fullName" | "serialNumber" | "rank" | "unit" | "status" | "dateOfEnlistment";
  sortOrder?: "asc" | "desc";
}

export class PersonnelService {
  static async getPersonnelList(params: GetPersonnelQueryParams = {}) {
    const {
      search,
      unit,
      rank,
      status,
      page = 1,
      limit = 10,
      sortBy = "id",
      sortOrder = "asc",
    } = params;

    const where: Prisma.PersonnelWhereInput = {};

    if (search && search.trim() !== "") {
      const searchTerm = search.trim();
      where.OR = [
        { fullName: { contains: searchTerm, mode: "insensitive" } },
        { serialNumber: { contains: searchTerm, mode: "insensitive" } },
        { position: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    if (unit && unit !== "ALL") {
      where.unit = unit;
    }

    if (rank && rank !== "ALL") {
      where.rank = rank;
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      prisma.personnel.count({ where }),
      prisma.personnel.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  static async getPersonnelById(id: number) {
    return await prisma.personnel.findUnique({
      where: { id },
    });
  }

  static async getPersonnelBySerialNumber(serialNumber: string) {
    return await prisma.personnel.findUnique({
      where: { serialNumber },
    });
  }

  static async generateNextSerialNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `SR-${currentYear}-`;

    const records = await prisma.personnel.findMany({
      where: {
        serialNumber: {
          startsWith: prefix,
        },
      },
      select: {
        serialNumber: true,
      },
    });

    let maxSeq = 0;
    for (const r of records) {
      const numPart = r.serialNumber.replace(prefix, "");
      const num = parseInt(numPart, 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }

    if (maxSeq === 0) {
      const total = await prisma.personnel.count();
      maxSeq = total;
    }

    const nextSeq = maxSeq + 1;
    return `${prefix}${String(nextSeq).padStart(4, "0")}`;
  }

  static async createPersonnel(data: PersonnelInput) {
    const isOfficer = OFFICER_RANKS.some((r) =>
      data.rank.toLowerCase().includes(r.toLowerCase())
    );
    const rankCategory = isOfficer ? "Officer" : "Enlisted Personnel";

    let serialNumber = data.serialNumber?.trim();
    if (!serialNumber) {
      serialNumber = await this.generateNextSerialNumber();
    }

    return await prisma.personnel.create({
      data: {
        fullName: data.fullName,
        serialNumber,
        rank: data.rank,
        rankCategory: data.rankCategory || rankCategory,
        birthday: new Date(data.birthday),
        gender: data.gender,
        civilStatus: data.civilStatus,
        phone: data.phone,
        email: data.email,
        address: data.address,
        unit: data.unit,
        position: data.position,
        dateOfEnlistment: new Date(data.dateOfEnlistment),
        status: data.status,
        photo: data.photo || null,
      },
    });
  }

  static async updatePersonnel(id: number, data: PersonnelInput) {
    const isOfficer = OFFICER_RANKS.some((r) =>
      data.rank.toLowerCase().includes(r.toLowerCase())
    );
    const rankCategory = isOfficer ? "Officer" : "Enlisted Personnel";

    return await prisma.personnel.update({
      where: { id },
      data: {
        fullName: data.fullName,
        rank: data.rank,
        rankCategory: data.rankCategory || rankCategory,
        birthday: new Date(data.birthday),
        gender: data.gender,
        civilStatus: data.civilStatus,
        phone: data.phone,
        email: data.email,
        address: data.address,
        unit: data.unit,
        position: data.position,
        dateOfEnlistment: new Date(data.dateOfEnlistment),
        status: data.status,
        photo: data.photo || null,
      },
    });
  }

  static async deletePersonnel(id: number) {
    return await prisma.personnel.delete({
      where: { id },
    });
  }

  static async getDashboardMetrics() {
    const [
      totalCount,
      activeCount,
      reserveCount,
      retiredCount,
      officersCount,
      enlistedCount,
      allPersonnel,
    ] = await Promise.all([
      prisma.personnel.count(),
      prisma.personnel.count({ where: { status: "Active" } }),
      prisma.personnel.count({ where: { status: "Reserve" } }),
      prisma.personnel.count({ where: { status: "Retired" } }),
      prisma.personnel.count({ where: { rankCategory: "Officer" } }),
      prisma.personnel.count({ where: { rankCategory: "Enlisted Personnel" } }),
      prisma.personnel.findMany({
        select: {
          rank: true,
          unit: true,
          status: true,
          rankCategory: true,
        },
      }),
    ]);

    const rankMap = new Map<string, number>();
    for (const p of allPersonnel) {
      rankMap.set(p.rank, (rankMap.get(p.rank) || 0) + 1);
    }
    const personnelByRank = Array.from(rankMap.entries())
      .map(([rank, count]) => ({ rank, count }))
      .sort((a, b) => b.count - a.count);

    const statusMap = new Map<string, number>();
    for (const p of allPersonnel) {
      statusMap.set(p.status, (statusMap.get(p.status) || 0) + 1);
    }
    const personnelByStatus = Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count,
    }));

    const unitMap = new Map<string, number>();
    for (const p of allPersonnel) {
      unitMap.set(p.unit, (unitMap.get(p.unit) || 0) + 1);
    }
    const personnelByUnit = Array.from(unitMap.entries())
      .map(([unit, count]) => ({ unit, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalPersonnel: totalCount,
      activePersonnel: activeCount,
      reservePersonnel: reserveCount,
      retiredPersonnel: retiredCount,
      officersCount,
      enlistedCount,
      personnelByRank,
      personnelByStatus,
      personnelByUnit,
    };
  }
}
