import { setGlobalState } from "@/components/state";
import { Client } from "@hyper-fetch/core";

export const client = new Client({
  url: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
})
  .setRequestDefaultOptions((request) => {
    return { ...request, options: { withCredentials: true } };
  })
  .onRequest((req) => {
    setGlobalState("loading", true);
    return req;
  })
  .onResponse((req) => {
    setTimeout(() => setGlobalState("loading", false), 600);
    return req;
  })
  .setDebug(true);
