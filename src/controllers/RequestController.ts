import {Controller} from "@/decorators/ControllerDecorator";
import {Get, Post} from "@/decorators/RouteDecorator";
import {Request, Response} from "express";
import Container, {Service} from "typedi";
import Joi from "joi";
import RequestRepository from "@/repository/RequestRepository";
import CarRepository from "@/repository/CarRepository";
import ParamConverter from "@/middleware/ParamConverter";
import RequestStatusRepository from "@/repository/RequestStatusRepository";

const paramConverter = Container.get(ParamConverter).middleware();

@Controller("/requests")
@Service()
export default class RequestController {
    constructor(
        private carRepository: CarRepository,
        private requestRepository: RequestRepository,
        private requestStatusRepository: RequestStatusRepository
    ) {}

    @Get("/:requestId", paramConverter)
    public async show(req: Request, res: Response) {
        res.status(200).send(res.locals.request);
    }

    @Post("")
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
                entity = await this.requestRepository.create(car.id);
            }
        } else {
            entity = await this.requestRepository.createWithNewCar(obj);
        }

        res.status(200).send(entity);
    }

    @Post("/:requestId/set-status", paramConverter)
    public async setStatus(req: Request, res: Response) {
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
