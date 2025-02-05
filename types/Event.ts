export type SyntheticEvent<T> = {
    target: {
        value: T,
        name: string | undefined,
    },
    type: string
}