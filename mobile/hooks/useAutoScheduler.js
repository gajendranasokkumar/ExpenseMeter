/**
 * useAutoScheduler
 *
 * Runs on every app-foreground event (AppState "active") and processes any
 * auto-budget or auto-transaction schedules that are due for the current user.
 *
 * Usage: call this hook inside the Layout component in app/_layout.jsx
 */
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useUser } from "../context/userContext";
import * as autoSchedulerService from "../services/autoSchedulerService";
import * as budgetService from "../services/budgetService";
import * as transactionService from "../services/transactionService";

const useAutoScheduler = () => {
  const { user } = useUser();
  const userId = user?._id;
  const appState = useRef(AppState.currentState);
  const isProcessing = useRef(false);

  const processSchedules = async (uid) => {
    if (!uid || isProcessing.current) return;
    isProcessing.current = true;
    try {
      const dueSchedules = await autoSchedulerService.getDueSchedules(uid);
      for (const schedule of dueSchedules) {
        try {
          if (schedule.type === "budget") {
            const payload = schedule.payload || {};
            // Rebuild dates for the new period
            const now = new Date();
            let start_date = new Date(now.getFullYear(), now.getMonth(), 1);
            let end_date = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            if (schedule.frequency === "daily") {
              start_date = now;
              end_date = now;
            } else if (schedule.frequency === "weekly") {
              const day = now.getDay();
              start_date = new Date(now);
              start_date.setDate(now.getDate() - day);
              end_date = new Date(start_date);
              end_date.setDate(start_date.getDate() + 6);
            }
            await budgetService.create({
              ...payload,
              user_id: uid,
              start_date,
              end_date,
              amount: Number(payload.amount),
            });
          } else if (schedule.type === "transaction") {
            const payload = schedule.payload || {};
            await transactionService.create({
              ...payload,
              user_id: uid,
              date: new Date(),
              amount: Number(payload.amount),
            });
          }
          // Advance the schedule to next run
          await autoSchedulerService.updateLastRun(schedule._id, schedule.frequency);
        } catch (_err) {
          // Silently continue — one failing schedule should not block others
        }
      }
    } catch (_err) {
      // Silently ignore top-level errors so app never crashes
    } finally {
      isProcessing.current = false;
    }
  };

  useEffect(() => {
    if (!userId) return;

    // Run once on mount (covers app cold-start)
    processSchedules(userId);

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (appState.current !== "active" && nextState === "active") {
        processSchedules(userId);
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
};

export default useAutoScheduler;
