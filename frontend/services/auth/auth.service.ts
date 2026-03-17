import { api } from "../api"

export const authService = {

  login(data: {
    email: string
    password: string
  }) {
    return api("/auth/login", {
      method: "POST",
      body: JSON.stringify(data)
    })
  },

  register(data: {
    name: string
    email: string
    password: string
  }) {
    return api("/auth/register", {
      method: "POST",
      body: JSON.stringify(data)
    })
  },

  me() {
    return api("/auth/me")
  }

}