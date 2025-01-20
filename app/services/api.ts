import {SearchParams} from "next/dist/server/request/search-params";

export const BASE_URL = process.env.NEXT_PUBLIC_HOSTNAME;

async function GET<T>(_url: string, params?: Record<string, string>): Promise<T> {
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

async function POST<T, K>(url: string, data: T): Promise<K> {
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

async function DELETE<T, K>(url: string, data: T): Promise<K> {
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

export const api = {
    GET,
    POST,
    DELETE
};
