import {Service} from "typedi";
import PrismaRepository from "@/repository/PrismaRepository";

@Service()
export default class RequestStatusRepository extends PrismaRepository {
    public async findAll() {
        return this.prisma.requestStatus.findMany();
    }
}
