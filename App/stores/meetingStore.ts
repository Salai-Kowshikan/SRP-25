import { create } from "zustand";
import api from "@/api/api";

interface Meeting {
  id: string;
  date: string;
  presentPeople: number;
  totalPeople: number;
  minutes: string;
  absentees: string[];
}

interface MeetingState {
  meetings: Meeting[];
  fetchMeetings: (shgId: string) => Promise<void>;
}

export const useMeetingStore = create<MeetingState>()((set) => ({
  meetings: [],
  fetchMeetings: async (shgId) => {
    try {
      const response = await api.get<{ data: any[] }>(`/api/meetings/${shgId}`);
      const mappedMeetings: Meeting[] = response.data.data.map((meeting) => ({
        id: meeting.meeting_id,
        date: meeting.date,
        presentPeople: meeting.present,
        totalPeople: meeting.present + meeting.absentees.length,
        minutes: meeting.minutes,
        absentees: meeting.absentees,
      }));
      set(() => ({ meetings: mappedMeetings }));
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  },
}));
