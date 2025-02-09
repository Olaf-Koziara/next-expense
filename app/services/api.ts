import {Dictionary} from "@/utils/global";

export type QueryParams = Record<string, string>;
export const BASE_URL = process.env.NEXT_PUBLIC_HOSTNAME;

async function GET<T>(_url: string, params?: QueryParams): Promise<T> {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${_url}/?${queryString}` : _url;
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error(res.statusText);
    }

    return res.json();
}

async function POST<T>(url: string, data: T): Promise<void> {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(res.statusText);
    }

    return res.json();
}

async function DELETE<T>(url: string, data: T) {

    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(res.statusText);
    }

    return res.json();
}

async function PATCH<T>(url: string, data: Partial<T> & Dictionary): Promise<T> {
    const res = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(res.statusText);
    }

    return res.json();
}

async function PUT<T>(url: string, data: T): Promise<T> {
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(res.statusText);
    }

    return res.json();
}

export const api = {
    GET,
    POST,
    DELETE,
    PATCH,
    PUT,
};
