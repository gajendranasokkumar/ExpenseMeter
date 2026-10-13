// Auto-Scheduler service — delegates to Firebase implementation.
import * as autoSchedulerFire from "./firebase/autoSchedulerFire";

export const createSchedule = async (data) => autoSchedulerFire.createSchedule(data);

export const getDueSchedules = async (userId) => autoSchedulerFire.getDueSchedules(userId);

export const updateLastRun = async (id, frequency) => autoSchedulerFire.updateLastRun(id, frequency);

export const removeSchedule = async (id) => autoSchedulerFire.removeSchedule(id);

export const getAll = async (userId) => autoSchedulerFire.getAll(userId);
