import {PrismaClient} from "@prisma/client";
import {Service} from "typedi";

@Service()
export default abstract class PrismaRepository {
    protected constructor(protected prisma: PrismaClient) {}
}
