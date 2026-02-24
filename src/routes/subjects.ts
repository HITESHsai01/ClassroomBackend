import express from 'express';
import { and, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import { departments, subjects } from '../db/schema';
import {db} from "../db";

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {search, department, page=1,limit=10} = req.query;

    const currentpage = Math.max(1, +page);
    const limitPerPage = Math.max(1, +limit);

    const offset = (currentpage - 1) * limitPerPage;

    const filterCondition = [];

    if (search) {
      filterCondition.push(
        or(
          ilike(subjects.name,`%${search}%`),
          ilike(subjects.code,`%${search}%`),
        )
      )
    }

    if (department) {
      filterCondition.push(ilike(departments.name,`%${departments}%`));
    }

    const whereClause = filterCondition.length > 0 ? and(...filterCondition) : undefined;

    const CountResult = await db.select({count: sql<number>`count(*)`}).from(subjects).leftJoin(departments,eq(subjects.departmentId,departments.id)).where(whereClause);

    const totalCount = CountResult[0]?.count ?? 0;

    const subjectsList = await db.select({
      ...getTableColumns(subjects),
      department:{...getTableColumns(departments)},
    }).from(subjects).leftJoin(departments,eq(subjects.departmentId,departments.id)).where(whereClause).orderBy(desc(subjects.createdAt)).limit(limitPerPage).offset(offset);

    res.status(200).json({
      data: subjectsList,
      pagination: {
        total: totalCount,
        page: currentpage,
        limit: limitPerPage,
        totalPages: Math.ceil(totalCount / limitPerPage),
      }
    });
  } catch (e) {
    console.error(`GET /subjects error: ${e}`);
    res.status(500).json({error: 'Failed to found subjects'});

  }
})

export default router;