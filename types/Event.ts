export type SyntheticEvent = {
    target: {
        value: string,
        name: string | undefined,
    },
    type: string
}