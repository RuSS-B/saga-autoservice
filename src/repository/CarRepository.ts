import PrismaRepository from "@/repository/PrismaRepository";
import {ICar} from "@/model/Car";
import {Service} from "typedi";

@Service()
export default class CarRepository extends PrismaRepository {
    public async findById(id: number) {
        return this.prisma.car.findUnique({
            where: {
                id: id,
            },
        });
    }

    public async findByVinCode(vinCode: string) {
        return this.prisma.car.findUnique({
            where: {
                vin: vinCode,
            },
        });
    }

    public async create(car: ICar) {
        return this.prisma.car.create({
            data: car,
        });
    }
}
