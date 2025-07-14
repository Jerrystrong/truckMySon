import { Request, Response, NextFunction } from 'express'

// Extend the SessionData interface to include 'user'
declare module 'express-session' {
    interface SessionData {
        user?: any;
    }
}

const isAuthentified = (req: Request, res: Response, next: NextFunction) => {
    if (req.session?.user) {
        next()
    }else{
        res.redirect('/login')
    }
}

export {isAuthentified}