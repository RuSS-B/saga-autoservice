import {Service} from "typedi";
import PrismaRepository from "@/repository/PrismaRepository";
import {ERequestStatus} from "@/model/RequestStatus";
import {ICar} from "@/model/Car";

@Service()
export default class RequestRepository extends PrismaRepository {
    public async create(carId: number, operatorId: number) {
        return this.prisma.request.create({
            data: {
                statusId: ERequestStatus.Open,
                operatorId,
                carId,
            },
        });
    }

    public async findNotDone(carId: number) {
        return this.prisma.request.findFirst({
            where: {
                statusId: {
                    not: ERequestStatus.Done,
                },
                carId,
            },
        });
    }

    public async createWithNewCar(car: ICar, operatorId: number) {
        return this.prisma.$transaction(async (tx) => {
            const entity = await tx.car.create({
                data: car,
            });

            return tx.request.create({
                data: {
                    statusId: ERequestStatus.Open,
                    operatorId,
                    carId: entity.id,
                },
            });
        });
    }

    public async findById(id: number) {
        return this.prisma.request.findUnique({
            include: {
                car: true,
                requestStatus: true,
            },
            where: {
                id: id,
            },
        });
    }

    public async setStatus(id: number, statusId: number) {
        return this.prisma.request.update({
            where: {
                id: id,
            },
            data: {
                statusId: statusId,
            },
        });
    }
}
