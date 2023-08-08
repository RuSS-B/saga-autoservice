import {Request, Response, NextFunction} from "express";
import {Service} from "typedi";
import createHttpError from "http-errors";
import {IMiddleware} from "@/middleware/IMiddleware";
import RequestRepository from "@/repository/RequestRepository";

@Service()
export default class ParamConverter {
    constructor(private requestRepository: RequestRepository) {}

    public middleware(): IMiddleware {
        return async function (
            req: Request,
            res: Response,
            next: NextFunction
        ) {
            if (req.params["requestId"]) {
                res.locals.request = await this.setRequest(
                    Number(req.params["requestId"])
                );
            }

            next();
        }.bind(this);
    }

    private async setRequest(id: number) {
        if (!id) {
            throw createHttpError.BadRequest(`a valid request id is required`);
        }

        const entity = await this.requestRepository.findById(id);

        if (!entity) {
            throw createHttpError.NotFound(`Request with ID: ${id} not found`);
        }

        return entity;
    }
}
