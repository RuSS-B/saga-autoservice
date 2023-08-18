import {IMiddleware} from "@/middleware/IMiddleware";
import {NextFunction, Request, Response} from "express";
import createHttpError from "http-errors";
import {Service} from "typedi";

@Service()
export default class UserMiddleware {
    public middleware(): IMiddleware {
        return async function (
            req: Request,
            res: Response,
            next: NextFunction
        ) {
            const userId = req.headers["x-user-id"];
            if (!userId) {
                throw createHttpError.Forbidden("No user id provided");
            }

            res.locals.userId = Number(userId);

            next();
        }.bind(this);
    }
}
