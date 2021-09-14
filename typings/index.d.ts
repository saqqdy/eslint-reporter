export interface AnyObject {
    [prop: string]: any
}

export interface AnyFunction extends AnyObject {
    (...args: any[]): any
}

export type ValueOf<T> = T extends ReadonlyArray<any> ? T[number] : T[keyof T]

export type ShellCode = 0 | 1 | 127

export interface CommandType {
    cmd: string
    config: QueueConfigType
}

export interface QueueConfigType {
    silent?: boolean
    again?: boolean
    success?: string
    fail?: string
    postmsg?: boolean
    kill?: boolean
}

export interface QueueReturnsType {
    code: ShellCode
    out: string
    err: string
    cfg: QueueConfigType
    cmd: string
}
