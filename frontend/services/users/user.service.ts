import { api } from "../api"

export const userService = {

  async profile() {

    const response = await api("/users/profile", {
      method: "GET",
      body: JSON.stringify({})
    })

    return response.data
  },

  async updateProfile(data: any) {

    const response = await api("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data)
    })

    return response.data
  }

}