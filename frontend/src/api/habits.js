import { request, post } from "./client.js";

// Server habit = { _id, h_name, ... }  →  UI habit = { id, name }
const toHabit = (h) => ({ id: h._id, name: h.h_name });

export const habits = {
  async list() {
    const data = await request("/api/habits");
    return data.habits.map(toHabit);
  },

  async create(name) {
    const data = await post("/api/habits", { h_name: name });
    return toHabit(data.habit);
  },

  async remove(id) {
    await request(`/api/habits/${id}`, { method: "DELETE" });
  },
};
