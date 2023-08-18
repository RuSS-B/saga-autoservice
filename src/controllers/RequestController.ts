import {Controller} from "@/decorators/ControllerDecorator";
import {Get, Post} from "@/decorators/RouteDecorator";
import {Request, Response} from "express";
import Container, {Service} from "typedi";
import Joi from "joi";
import RequestRepository from "@/repository/RequestRepository";
import CarRepository from "@/repository/CarRepository";
import ParamConverter from "@/middleware/ParamConverter";
import RequestStatusRepository from "@/repository/RequestStatusRepository";
import UserMiddleware from "@/middleware/UserMiddleware";
import createHttpError from "http-errors";

const paramConverter = Container.get(ParamConverter).middleware();
const userMiddleware = Container.get(UserMiddleware).middleware();

@Controller("/requests")
@Service()
export default class RequestController {
    constructor(
        private carRepository: CarRepository,
        private requestRepository: RequestRepository,
        private requestStatusRepository: RequestStatusRepository
    ) {}

    @Get("/:requestId", paramConverter, userMiddleware)
    public async show(req: Request, res: Response) {
        if (res.locals.request.operatorId !== res.locals.userId) {
            throw createHttpError.Forbidden();
        }

        res.status(200).send(res.locals.request);
    }

    @Post("", userMiddleware)
    public async create(req: Request, res: Response) {
        const schema = Joi.object({
            vin: Joi.string().length(17).min(17).required(),
            plateNumber: Joi.string().allow(null).required(),
        });

        const obj = await schema.validateAsync(req.body);

        const car = await this.carRepository.findByVinCode(obj.vin);

        let entity;
        if (car) {
            entity = await this.requestRepository.findNotDone(car.id);

            if (!entity) {
                entity = await this.requestRepository.create(
                    car.id,
                    res.locals.userId
                );
            }
        } else {
            entity = await this.requestRepository.createWithNewCar(
                obj,
                res.locals.userId
            );
        }

        res.status(200).send(entity);
    }

    @Post("/:requestId/set-status", paramConverter, userMiddleware)
    public async setStatus(req: Request, res: Response) {
        if (res.locals.request.operatorId !== res.locals.userId) {
            throw createHttpError.Forbidden();
        }

        const allStatuses = await this.requestStatusRepository.findAll();
        const allowedStatuses = allStatuses.map((status) => status.name);

        const schema = Joi.object({
            status: Joi.string()
                .required()
                .valid(...allowedStatuses),
        });

        const obj = await schema.validateAsync(req.body);

        const status = allStatuses.find((status) => status.name === obj.status);

        const request = await this.requestRepository.setStatus(
            res.locals.request.id,
            status.id
        );

        res.status(200).send(request);
    }
}
