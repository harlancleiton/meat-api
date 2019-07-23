import * as restify from 'restify';

export const errorHandler = (req: restify.Request, res: restify.Response, err: any, callback: () => void) => {
    err.toJSON = () => {
        return {
            message: err.message,
            name: err.name
        };
    };
    switch (err.name) {
        case 'MongoError':
            if (err.code === 11000) {
                err.statusCode = 400;
            }
            break;
        case 'ValidationError':
            err.statusCode = 400;
            const messages: any[] = [];
            for (const name in err.errors) {
                if (err.errors[name]) {
                    messages.push({ message: err.errors[name].message });
                }
            }
            err.toJSON = () => ({
                errors: messages,
            });
            break;
    }
    return callback();
};
