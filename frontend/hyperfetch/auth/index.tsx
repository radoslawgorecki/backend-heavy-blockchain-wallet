import { Wallet } from "@/types";
import { client } from "@/hyperfetch/server/client";
type LoginResponse = { address: string; currency: string };
type LoginRequest = { username: string; password: string };
type RegisterResponse = {
  privateKey: string;
  mnemonic: string;
  address: string;
};
type RegisterEmailRequest = {
  password: string;
};

export const authMe = client.createRequest<Wallet>()({
  endpoint: "/auth/me",
  method: "GET",
  cache: true,
  queued: true,
  queueKey: "auth-me",
});

export const login = client.createRequest<LoginResponse, LoginRequest>()({
  method: "POST",
  cache: true,
  auth: true,
  endpoint: "/auth/login/:address",
});

export const register = client.createRequest<
  RegisterResponse,
  RegisterEmailRequest
>()({
  method: "POST",
  endpoint: "/auth/register",
  auth: false,
  queued: true,
});

export const logout = client.createRequest()({
  endpoint: "/auth/logout",
  method: "GET",
  queued: true,
});
